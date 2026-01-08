from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
 
DATABASE_URL = (
    "mssql+pyodbc://@DESKTOP-N3UHV52\\SQLEXPRESS/ETLSAMPLE"
    "?driver=ODBC+Driver+17+for+SQL+Server"
    "&trusted_connection=yes"
)
 
engine = create_engine(DATABASE_URL)
 
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)
 
# ✅ THIS IS MANDATORY
Base = declarative_base()