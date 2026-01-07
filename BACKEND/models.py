 
from sqlalchemy import Column, Float, Integer, String, Date, BigInteger, Numeric, CHAR
from database import Base   # ✅ ONLY import Base, do NOT redefine

class SalesReport(Base):
    __tablename__ = "SalesReport"
    id = Column(Integer, primary_key=True, index=True)
    product_name = Column(String(100))
    quantity = Column(Integer)
    total_amount = Column(Float)
    sale_date = Column(Date)

class EmployeeReport(Base):
    __tablename__ = "EmployeeReport"
    EmployeeID = Column(Integer, primary_key=True)
    EmployeeName = Column(String)
    Department = Column(String)
    Salary = Column(Integer)
    JoiningDate = Column(Date)

# ✅ BankAccountSummary table
class BankAccountSummary(Base):
    __tablename__ = "BankAccountSummary"
    account_type = Column(String(30), primary_key=True)
    total_accounts = Column(Integer)

# ✅ NEW LoanDistribution table
class LoanDistribution(Base):
    __tablename__ = "LoanDistribution"
    loan_type = Column(String(50), primary_key=True)
    total_amount = Column(BigInteger)
 
 
# ✅ NEW: TS_TDS_LOG_TD_DEP_MAST table
class TSTdsLogTdDepMast(Base):
    __tablename__ = "TS_TDS_LOG_TD_DEP_MAST"
 
    COD_ACCT_NO = Column(CHAR(16), primary_key=True)
    COD_CUST = Column(Integer)
    COD_CC_BRN = Column(Integer)
    COD_PROD = Column(Integer)
    DAT_DEP_DATE = Column(Date)
    DAT_CLOSE = Column(Date)
    BAL_PRINCIPAL = Column(Numeric(18, 2))
    RAT_DEP_INT = Column(Numeric(5, 2))
    BAL_INT_PROJECTED = Column(Numeric(18, 2))
    AMT_EXEMPT_LMT = Column(Numeric(18, 2))