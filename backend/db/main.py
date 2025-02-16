import os
from sqlalchemy import Column, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.ext.asyncio import async_sessionmaker
from sqlalchemy.future import select
import uuid
from datetime import datetime
from typing import Optional, List, Type, TypeVar

# Database setup
database_dir = os.path.join(os.getcwd(), 'db')
database_path = os.path.join(database_dir, f'database_local.db')
DATABASE_URL = f'sqlite+aiosqlite:///{database_path}'  # Use aiosqlite for async SQLite

# Create the async engine and sessionmaker
engine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)

# Base class for models
Base = declarative_base()

# Type variable for model classes
T = TypeVar('T', bound='DB_BaseModel')

class DB_BaseModel(Base):
    __abstract__ = True
    id = Column(String(60), unique=True, nullable=False, primary_key=True)
    createAt = Column(DateTime, default=datetime.now, nullable=False)
    updateAt = Column(DateTime, default=datetime.now, onupdate=datetime.now, nullable=False)

    def __init__(self, *args, **kwargs):
        if kwargs:
            for key, value in kwargs.items():
                if key == "created_at" or key == "updated_at":
                    value = datetime.strptime(value, "%Y-%m-%dT%H:%M:%S.%f")
                if key != "__class__":
                    setattr(self, key, value)
            if "id" not in kwargs:
                self.id = str(uuid.uuid4())
            if "createAt" not in kwargs:
                self.createAt = datetime.now()
            if "updateAt" not in kwargs:
                self.updateAt = datetime.now()
        else:
            self.id = str(uuid.uuid4())
            self.createAt = self.updateAt = datetime.now()

    def __str__(self):
        return f"[{type(self).__name__}] ({self.id}) {self.__dict__}"

    def __repr__(self):
        return self.__str__()

    def to_dict(self):
        my_dict = dict(self.__dict__)
        my_dict["__class__"] = str(type(self).__name__)
        my_dict["createAt"] = self.createAt.isoformat()
        my_dict["updateAt"] = self.updateAt.isoformat()
        my_dict.pop('_sa_instance_state', None)
        return my_dict

    @classmethod
    async def get_session(cls) -> AsyncSession:
        """Get an async database session."""
        async with AsyncSessionLocal() as session:
            return session

    @classmethod
    async def get_all(cls: Type[T]) -> List[T]:
        """Get all records of the model."""
        async with AsyncSessionLocal() as session:
            result = await session.execute(select(cls))
            return result.scalars().all()

    @classmethod
    async def get_id(cls: Type[T], **criteria) -> Optional[str]:
        """Fetch only the ID of the first matching record based on criteria."""
        async with AsyncSessionLocal() as session:
            result = await session.execute(select(cls.id).filter_by(**criteria))
            return result.scalar()

    @classmethod
    async def filter_by(cls: Type[T], **criteria) -> Optional[T]:
        """Filter records by criteria and return the first match."""
        async with AsyncSessionLocal() as session:
            result = await session.execute(select(cls).filter_by(**criteria))
            return result.scalars().first()

    @classmethod
    async def filter_all(cls: Type[T], **criteria) -> Optional[T]:
        """Filter records by criteria and return the first match."""
        async with AsyncSessionLocal() as session:
            result = await session.execute(select(cls).filter_by(**criteria))
            return result.scalars().all()

    @classmethod
    async def filter_by_id(cls: Type[T], idRecord: str) -> Optional[T]:
        """Filter records by id and return the first match."""
        async with AsyncSessionLocal() as session:
            result = await session.execute(select(cls).filter_by(id=idRecord))
            return result.scalars().first()

    @classmethod
    async def create(cls: Type[T], **kwargs) -> T:
        """Create a new record in the database."""
        async with AsyncSessionLocal() as session:
            record = cls(**kwargs)
            session.add(record)
            await session.commit()
            await session.refresh(record)
            return record

    @classmethod
    async def update(cls: Type[T], idRecord: str, **kwargs) -> Optional[T]:
        """Update a record in the database."""
        async with AsyncSessionLocal() as session:
            result = await session.execute(select(cls).filter_by(id=idRecord))
            record = result.scalars().first()
            if record is not None:
                for key, value in kwargs.items():
                    setattr(record, key, value)
                await session.commit()
                await session.refresh(record)
                return record
            print(f"Record with id {idRecord} not found to be updated.")
            return None

    @classmethod
    async def delete(cls: Type[T], idRecord: str) -> bool:
        """Delete a record from the database."""
        async with AsyncSessionLocal() as session:
            result = await session.execute(select(cls).filter_by(id=idRecord))
            record = result.scalars().first()
            if record:
                await session.delete(record)
                await session.commit()
                return True
            return False

async def check_db():
    """Create the database if it doesn't exist."""
    if os.path.exists(database_path):
        print("Warning: Database already exists. Skipping creation...")
    else:
        async with engine.begin() as conn:
            from .models import User, Client, Worker, Contract, Meeting
            await conn.run_sync(Base.metadata.create_all)
        print('Database created successfully')