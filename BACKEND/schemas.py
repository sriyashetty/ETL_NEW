from pydantic import BaseModel
from datetime import date
from decimal import Decimal

class SalesReportSchema(BaseModel):
    id: int
    product_name: str
    quantity: int
    total_amount: float
    sale_date: date
    class Config:
        orm_mode = True

class EmployeeReportSchema(BaseModel):
    EmployeeID: int
    EmployeeName: str
    Department: str
    Salary: int
    JoiningDate: date
    class Config:
        orm_mode = True

class BankAccountSummarySchema(BaseModel):
    account_type: str
    total_accounts: int
    class Config:
        orm_mode = True

# ✅ NEW LoanDistribution schema
class LoanDistributionSchema(BaseModel):
    loan_type: str
    total_amount: int
    class Config:
        orm_mode = True
 
 
class TSTdsLogTdDepMastSchema(BaseModel):
    COD_ACCT_NO: str                 # CHAR(16)
    COD_CUST: int                    # NUMERIC(10,0)
    COD_CC_BRN: int                  # NUMERIC(5,0)
    COD_PROD: int                    # NUMERIC(10,0)
    DAT_DEP_DATE: date               # DATE
    DAT_CLOSE: date                  # DATE
    BAL_PRINCIPAL: Decimal           # NUMERIC(18,2)
    RAT_DEP_INT: Decimal             # NUMERIC(5,2)
    BAL_INT_PROJECTED: Decimal       # NUMERIC(18,2)
    AMT_EXEMPT_LMT: Decimal          # NUMERIC(18,2)
 
    class Config:
        orm_mode = True