# from sqlalchemy import Column, ForeignKey, Integer, String, Boolean, Date, Time
# from sqlalchemy.orm import relationship
# from tools.Bd_BaseModel import DB_BaseModel, Base
# from sqlalchemy import Column, String, Integer, Boolean, ForeignKey, Date, Time
# from sqlalchemy.orm import relationship


# class User(DB_BaseModel, Base):
#     __tablename__ = 'users'
#     username = Column(String(50), nullable=False, unique=True, index=True)
#     email = Column(String(100), nullable=False, unique=True, index=True)
#     hashed_password = Column(String(100), nullable=False)
#     adress = Column(String(255), nullable=True)
#     disabled = Column(Boolean, default=False)
#     is_verifier = Column(Boolean, default=False)
#     is_admin = Column(Boolean, default=False)
#     first_name = Column(String(200), nullable=False)
#     last_name = Column(String(200), nullable=False)
#     url_photo = Column(String(255), nullable=True)
#     phone = Column(String(20), nullable=True)
#     role = Column(String(50), nullable=False) #Admin, Worker, Client

#     worker = relationship("Worker", uselist=False, back_populates="user")
#     client = relationship("Client", uselist=False, back_populates="user")
    

# class Client(DB_BaseModel, Base):
#     __tablename__ = 'clients'

#     user_id = Column(String(60), ForeignKey("users.id", ondelete="CASCADE", onupdate="CASCADE"))
#     user = relationship("User", back_populates="client", lazy="joined")

#     contracts = relationship("Contract", back_populates="client", cascade="all, delete, save-update")

# class Worker(DB_BaseModel, Base):
#     __tablename__ = 'workers'

#     user_id = Column(String(60), ForeignKey("users.id", ondelete="CASCADE", onupdate="CASCADE"))
#     user = relationship("User", back_populates="worker", lazy="joined")

#     contracts = relationship("Contract", back_populates="worker", cascade="all, delete, save-update")

# class Contract(DB_BaseModel, Base):
#     __tablename__ = 'contracts'

#     num_contract = Column(String(50), nullable=False, unique=True, index=True)
#     date_contract = Column(Date, nullable=False)
#     date_start = Column(Date, nullable=False)
#     date_end = Column(Date, nullable=False)
#     type_contract = Column(String(50), nullable=False)
#     hours_count = Column(Integer, nullable=False)
#     hours_confirmed = Column(Integer, default=0)

#     client_id = Column(String(60), ForeignKey("clients.id", ondelete="CASCADE", onupdate="CASCADE"))
#     client = relationship("Client", back_populates="contracts", lazy="joined")

#     worker_id = Column(String(60), ForeignKey("workers.id", ondelete="CASCADE", onupdate="CASCADE"))
#     worker = relationship("Worker", back_populates="contracts", lazy="joined")

#     meetings = relationship("Meeting", back_populates="contract", cascade="all, delete, save-update")


# class Meeting(DB_BaseModel, Base):
#     __tablename__ = 'meetings'

#     date_meeting = Column(Date, nullable=False)
#     time_start = Column(Time, nullable=False)
#     time_end = Column(Time, nullable=False)
#     comment = Column(String(255), nullable=True)
#     confirmed = Column(Boolean, default=False)

#     contract_id = Column(String(60), ForeignKey("contracts.id", ondelete="CASCADE", onupdate="CASCADE"))
#     contract = relationship("Contract", back_populates="meetings", lazy="joined")

