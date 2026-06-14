import os
# pyrefly: ignore [missing-import]
from sqlalchemy import Column, String, DateTime, func
# pyrefly: ignore [missing-import]
from sqlalchemy.ext.declarative import declarative_base
# pyrefly: ignore [missing-import]
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
# pyrefly: ignore [missing-import]
from sqlalchemy.ext.asyncio import async_sessionmaker
# pyrefly: ignore [missing-import]
from sqlalchemy.future import select
import uuid
from datetime import datetime
from typing import Dict, Optional as Opt, List, Type, TypeVar, Union
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import selectinload

# 1. Extract environment-driven connection arguments with fallback values
DB_USER = os.getenv("DB_USER", "assistance_admin")
DB_PASSWORD = os.getenv("DB_PASSWORD", "vault_secure_pass")
DB_HOST = os.getenv("DB_HOST", "assistance24-db")  # Matches Docker service naming convention
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "assistance24_prod")

# 2. Build the Async PostgreSQL connection string using the asyncpg driver
DATABASE_URL = f"postgresql+asyncpg://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# 3. Instantiate the high-performance async communication engine
engine = create_async_engine(
    DATABASE_URL, 
    echo=False,
    pool_size=20,            # Architecture tuning: maintains 20 persistent connections
    max_overflow=10,         # Permits surge capacity up to 30 connections during spikes
    pool_pre_ping=True       # Healthcheck verification: tests connections before allocation
)

# 4. Generate the session constructor factory pool
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)

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
                if isinstance(value, uuid.UUID):
                    value = str(value)
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
    async def get_all(
        cls: Type[T],
        relationships: Opt[List[str]] = None,
        limit: int = 10,
        page: int = 1
    ) -> Dict[str, Union[List[T], int]]:
        async with AsyncSessionLocal() as session:
            total_records = await session.execute(select(func.count()).select_from(cls))
            total_records = total_records.scalar()

            total_records = int(total_records or 0)
            total_pages = (total_records // limit) + (1 if total_records % limit != 0 else 0)
            page = max(1, page)
            offset = (page - 1) * limit

            query = select(cls).order_by(cls.createAt.desc())  # type: ignore # Order by createAt DESC

            if relationships:
                for relation in relationships:
                    if hasattr(cls, relation):
                        query = query.options(selectinload(getattr(cls, relation)))

            query = query.limit(limit).offset(offset)

            result = await session.execute(query)
            data = list(result.scalars().all() or [])

            return {
                "data": data,
                "total_records": int(total_records or 0),
                "total_pages": int(total_pages or 0),
                "current_page": int(page or 1),
                "limit": int(limit or 10)
            }

    @classmethod
    async def filter_all(
        cls: Type[T], 
        relationships: Opt[List[str]] = None, 
        limit: int = 10, 
        page: int = 1, 
        **criteria
    ) -> Dict[str, Union[List[T], int]]:
        criteria = {k: (str(v) if isinstance(v, uuid.UUID) else v) for k, v in criteria.items()}
        async with AsyncSessionLocal() as session:
            total_records = await session.execute(select(func.count()).select_from(cls).filter_by(**criteria))
            total_records = total_records.scalar()
            total_records = int(total_records or 0)

            total_pages = (total_records // limit) + (1 if total_records % limit != 0 else 0)
            page = max(1, page)
            offset = (page - 1) * limit

            query = select(cls).filter_by(**criteria).order_by(cls.createAt.desc())  # type: ignore # Order by createAt DESC

            if relationships:
                for relation in relationships:
                    if hasattr(cls, relation):
                        query = query.options(selectinload(getattr(cls, relation)))

            query = query.limit(limit).offset(offset)

            result = await session.execute(query)
            data = result.scalars().all()

            return {
                "data": list(data or []),
                "total_records": total_records,
                "total_pages": total_pages,
                "current_page": page,
                "limit": limit
            }

    @classmethod
    async def get_id(cls: Type[T], **criteria) -> Opt[str]:
        """Fetch only the ID of the first matching record based on criteria."""
        criteria = {k: (str(v) if isinstance(v, uuid.UUID) else v) for k, v in criteria.items()}
        async with AsyncSessionLocal() as session:
            result = await session.execute(select(getattr(cls, "id")).filter_by(**criteria))
            return result.scalar_one_or_none()

    @classmethod
    async def filter_by_first(cls: Type[T], relationships: Opt[List[str]] = None, **criteria) -> Opt[T]:
        """Filter records by criteria and return the first match, with optional relationship loading."""
        criteria = {k: (str(v) if isinstance(v, uuid.UUID) else v) for k, v in criteria.items()}
        async with AsyncSessionLocal() as session:
            query = select(cls).filter_by(**criteria)

            if relationships:
                for relation in relationships:
                    if hasattr(cls, relation):
                        query = query.options(selectinload(getattr(cls, relation)))

            result = await session.execute(query)
            return result.scalars().first()

    @classmethod
    async def filter_by_id(cls: Type[T], idRecord: str, relationships: Opt[List[str]] = None) -> Opt[T]:
        """Filter records by id and return the first match, with optional relationship loading."""
        if isinstance(idRecord, uuid.UUID):
            idRecord = str(idRecord)
        async with AsyncSessionLocal() as session:
            query = select(cls).filter_by(id=idRecord)

            if relationships:
                for relation in relationships:
                    if hasattr(cls, relation):
                        query = query.options(selectinload(getattr(cls, relation)))

            result = await session.execute(query)
            return result.scalars().first()

    @classmethod
    async def create(cls: Type[T], unique_fields: Opt[List[str]] = None, **kwargs) -> Dict[str, Union[bool, str, T]]:
        """Create a new record in the database, ensuring unique constraints."""
        kwargs = {k: (str(v) if isinstance(v, uuid.UUID) else v) for k, v in kwargs.items()}
        async with AsyncSessionLocal() as session:
            # Check unique fields if provided
            if unique_fields:
                filter_conditions = {field: kwargs[field] for field in unique_fields if field in kwargs}
                for key, value in filter_conditions.items():
                    result = await session.execute(select(cls).filter_by(**{key: value}))
                    existing_record = result.scalars().first()
                    if existing_record:
                        return {"success": False, "message": f'[{cls.__name__}]: Record ({value}) already exists on {key}(s)'}

            # Create and persist new record
            record = cls(**kwargs)
            session.add(record)
            await session.commit()
            await session.refresh(record)
            return {"success": True, "data": record}

    @classmethod
    async def update(cls: Type[T], id_record: str, relationships: Opt[List[str]] = None, **kwargs) -> Opt[T]:
        """Update a record in the database and return the updated instance."""
        if isinstance(id_record, uuid.UUID):
            id_record = str(id_record)
        kwargs = {k: (str(v) if isinstance(v, uuid.UUID) else v) for k, v in kwargs.items()}
        async with AsyncSessionLocal() as session:
            result = await session.execute(select(cls).filter_by(id=id_record))
            record = result.scalars().first()

            if not record:
                return None

            for key, value in kwargs.items():
                setattr(record, key, value)

            session.add(record)
            await session.commit()

            if relationships:
                query = select(cls).filter_by(id=id_record)
                for relation in relationships:
                    if hasattr(cls, relation):
                        query = query.options(selectinload(getattr(cls, relation)))
                result = await session.execute(query)
                record = result.scalars().first()
            else:
                await session.refresh(record)

            return record

    @classmethod
    async def delete(cls: Type[T], idRecord: str) -> bool:
        """Delete a record from the database."""
        if isinstance(idRecord, uuid.UUID):
            idRecord = str(idRecord)
        async with AsyncSessionLocal() as session:
            result = await session.execute(select(cls).filter_by(id=idRecord))
            record = result.scalars().first()

            if record:
                await session.delete(record)
                await session.commit()
                return True
            return False



async def init_database():
    """
    Establishes the connection mesh with the PostgreSQL cluster 
    and initializes schema metadata structures if missing.
    """
    try:
        # Open an engine connection block to verify network transport availability
        async with engine.begin() as conn:
            print("Architectural Sync: Checking and aligning database schema definitions...")
            
            # Import models to register them with the Base metadata pool
            from .models import User, Contract, Meeting, Notification, FCMToken
            
            # Safely generates missing tables natively without destructive overwrites
            await conn.run_sync(Base.metadata.create_all)
            
        print("Database connectivity established and schema verification successful.")
    except Exception as e:
        print(f"CRITICAL: Failed to initialize database connection gateway. Error: {e}")
        # In a production pipeline, you might want to raise this to halt container startup
        raise e