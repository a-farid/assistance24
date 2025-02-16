# import os
# from sqlalchemy import Column, Date, String
# import uuid
# from datetime import datetime
# from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy import create_engine
# from sqlalchemy.exc import SQLAlchemyError
# from sqlalchemy.orm import sessionmaker


# database_dir = os.path.join(os.getcwd(), 'database')
# database_path = os.path.join(database_dir, f'database_local.db')
# DATABASE_URL = f'sqlite:///{database_path}'
# # Create the Base class for defining models
# engine = create_engine(DATABASE_URL, echo=False)
# Base = declarative_base()

# class DB_BaseModel:
#     __abstract__ = True
#     id = Column(String(60), unique=True, nullable=False, primary_key=True)
#     createAt = Column(Date, default=datetime.now, nullable=False)
#     updateAt = Column(Date, default=datetime.now, onupdate=datetime.now, nullable=False)

#     def __init__(self, *args, **kwargs):
#         if kwargs:
#             for key, value in kwargs.items():
#                 if key == "created_at" or key == "updated_at":
#                     value = datetime.strptime(value, "%Y-%m-%dT%H:%M:%S.%f")
#                 if key != "__class__":
#                     setattr(self, key, value)
#             if "id" not in kwargs:
#                 self.id = str(uuid.uuid4())
#             if "createAt" not in kwargs:
#                 self.createAt = datetime.now()
#             if "updateAt" not in kwargs:
#                 self.updateAt = datetime.now()
#         else:
#             self.id = str(uuid.uuid4())
#             self.createAt = self.updateAt = datetime.now()

#     def __str__(self):
#         return f"[{type(self).__name__}] ({self.id}) {self.__dict__}"

#     def __repr__(self):
#         return self.__str__()

#     def to_dict(self):
#         my_dict = dict(self.__dict__)
#         my_dict["__class__"] = str(type(self).__name__)
#         my_dict["createAt"] = self.createAt.isoformat()
#         my_dict["updateAt"] = self.updateAt.isoformat()
#         my_dict.pop('_sa_instance_state', None)
#         return my_dict

#     @staticmethod
#     def get_session():
#         Session = sessionmaker(bind=engine)
#         return Session()

#     @classmethod
#     def get_all(cls):
#         session = cls.get_session()
#         try:
#             return session.query(cls).all()
#         finally:
#             session.close()

#     @classmethod
#     def filter_by(cls, **criteria):
#         # Filter by criteria on record in database
#         session = cls.get_session()
#         try:
#             query = session.query(cls).filter_by(**criteria).first()
#             return query
#         finally:
#             session.close()

#     @classmethod
#     def create(cls, **kwargs):
#         # Create new record in database
#         session = cls.get_session()
#         try:
#             record = cls(**kwargs)
#             session.add(record)
#             session.commit()
#             return record
#         except SQLAlchemyError as e:
#             session.rollback()
#             raise e
#         finally:
#             session.close()

#     @classmethod
#     def update(cls, idRecord, **kwargs):
#         # Update record in database
#         session = cls.get_session()
#         try:
#             record = session.query(cls).filter_by(id=idRecord).first()
#             if record:
#                 for key, value in kwargs.items():
#                     setattr(record, key, value)
#                 session.commit()
#                 return record
#             else:
#                 return None
#         except SQLAlchemyError as e:
#             session.rollback()
#             raise e
#         finally:
#             session.close()

#     @classmethod
#     def delete(cls, idRecord):
#         # Delete a record from database
#         session = cls.get_session()
#         try:
#             record = session.query(cls).filter_by(id=idRecord).first()
#             if record:
#                 session.delete(record)
#                 session.commit()
#                 return True
#             else:
#                 return False
#         except SQLAlchemyError as e:
#             session.rollback()
#             raise e
#         finally:
#             session.close()


# def check_db():
#     # Create database of application
#     if os.path.exists(database_path):
#         return print("Warning:","Database already exists. Skipping creation...")
#     else:
#         from .models import User, Client, Worker, Contract, Meeting
#         Base.metadata.create_all(engine)
#         print('Database created successfully')
