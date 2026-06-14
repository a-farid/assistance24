# pyrefly: ignore [missing-import]
from sqlalchemy import UUID, Column, Enum, ForeignKey, Integer, String, Boolean, Date, Time
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import relationship
from .Db_BaseModel import DB_BaseModel, Base
# pyrefly: ignore [missing-import]
from sqlalchemy import Column, String, Integer, Boolean, ForeignKey, Date, Time
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import relationship


class User(DB_BaseModel, Base):
    __tablename__ = 'users'

    username = Column(String(50), nullable=False, unique=True, index=True)
    email = Column(String(100), nullable=False, unique=True, index=True)
    hashed_password = Column(String(100), nullable=True)
    adress = Column(String(255), nullable=True)
    disabled = Column(Boolean, default=False)
    is_verified = Column(Boolean, default=False)
    
    first_name = Column(String(200), nullable=False)
    last_name = Column(String(200), nullable=False)
    url_photo = Column(String(255), nullable=True)
    phone = Column(String(20), nullable=True)
    
    # Polymorphic Role Discriminator: Declares the context of the account profile
    role = Column(Enum("admin", "worker", "client", name="user_role"), nullable=False)

    # Relationship Matrices pointing directly to Contracts
    client_contracts = relationship(
        "Contract", 
        foreign_keys="Contract.client_id", 
        back_populates="client", 
        cascade="all, delete"
    )
    worker_contracts = relationship(
        "Contract", 
        foreign_keys="Contract.worker_id", 
        back_populates="worker", 
        cascade="all, delete"
    )
    
    notifications = relationship("Notification", back_populates="receiver", cascade="all, delete")
    fcm_token = relationship("FCMToken", uselist=False, back_populates="user", lazy="joined")


class Contract(DB_BaseModel, Base):
    __tablename__ = 'contracts'

    num_contract = Column(String(50), nullable=False, unique=True, index=True)
    date_contract = Column(Date, nullable=False)
    date_start = Column(Date, nullable=False)
    date_end = Column(Date, nullable=False)
    type_contract = Column(String(50), nullable=False)
    hours_count = Column(Integer, nullable=False)
    hours_confirmed = Column(Integer, default=0)

    # Architectural Optimization: Foreign keys now map directly to the users table
    client_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    client = relationship("User", foreign_keys=[client_id], back_populates="client_contracts")

    worker_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    worker = relationship("User", foreign_keys=[worker_id], back_populates="worker_contracts")

    meetings = relationship("Meeting", back_populates="contract", cascade="all, delete")


class Meeting(DB_BaseModel, Base):
    __tablename__ = 'meetings'

    date_meeting = Column(Date, nullable=False)
    time_start = Column(Time, nullable=False)
    time_end = Column(Time, nullable=False)
    comment = Column(String(255), nullable=True)
    status = Column(Enum("pending", "accepted", "rejected", name="status"), default="pending", nullable=False)

    contract_id = Column(String(36), ForeignKey("contracts.id", ondelete="CASCADE", onupdate="CASCADE"))
    contract = relationship("Contract", back_populates="meetings", lazy="select")

class Notification(DB_BaseModel, Base):
    __tablename__ = 'notifications'

    receiver_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(100), nullable=False)
    message = Column(String(255), nullable=False)
    read = Column(Boolean, default=False)
    link = Column(String(255), nullable=True)

    receiver = relationship("User", back_populates="notifications", lazy="selectin")

class FCMToken(DB_BaseModel, Base):
    __tablename__ = "fcm_tokens"

    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE", onupdate="CASCADE"))

    user = relationship("User", back_populates="fcm_token", lazy="select")
    token = Column(String, unique=True, nullable=True)
    status = Column(Enum("valid", "expired", name="token_status"), default="valid", nullable=False)


