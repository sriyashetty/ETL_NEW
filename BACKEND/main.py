from fastapi import FastAPI, Depends, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional, Union

from database import SessionLocal
from models import (
    SalesReport,
    EmployeeReport,
    BankAccountSummary,
    LoanDistribution,
    TSTdsLogTdDepMast          
)
from schemas import (
    SalesReportSchema,
    EmployeeReportSchema,
    BankAccountSummarySchema,
    LoanDistributionSchema,
    TSTdsLogTdDepMastSchema   
)

app = FastAPI(title="Report Service")

# CORS (for React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# API: Generate Report (MULTI-TABLE SUPPORT)
@app.get(
    "/generate-report",
    response_model=Union[
        List[SalesReportSchema],
        List[EmployeeReportSchema],
        List[BankAccountSummarySchema],
        List[LoanDistributionSchema],
        List[TSTdsLogTdDepMastSchema]
    ]
)
def generate_report(
    table: str = Query(..., description="sales | employee | bank | loan | tds"),

    # TDS Filters
    account_no: Optional[str] = Query(None, description="Account number"),
    customer_id: Optional[int] = Query(None, description="Customer ID"),
    branch_code: Optional[int] = Query(None, description="Branch code"),
    product_code: Optional[int] = Query(None, description="Product code"),

    db: Session = Depends(get_db)
):

    if table == "sales":
        return db.query(SalesReport).all()

    elif table == "employee":
        return db.query(EmployeeReport).all()

    elif table == "bank":
        return db.query(BankAccountSummary).all()

    elif table == "loan":
        return db.query(LoanDistribution).all()

    elif table == "tds":

        # Safety rule: at least one filter must be provided
        if not any([account_no, customer_id, branch_code, product_code]):
            raise HTTPException(
                status_code=400,
                detail="At least one filter is required for TDS data"
            )

        query = db.query(TSTdsLogTdDepMast)

        # Apply filters dynamically
        if account_no:
            query = query.filter(TSTdsLogTdDepMast.COD_ACCT_NO == account_no)

        if customer_id:
            query = query.filter(TSTdsLogTdDepMast.COD_CUST == customer_id)

        if branch_code:
            query = query.filter(TSTdsLogTdDepMast.COD_CC_BRN == branch_code)

        if product_code:
            query = query.filter(TSTdsLogTdDepMast.COD_PROD == product_code)

        return query.all()

    else:
        raise HTTPException(
            status_code=400,
            detail="Invalid table name. Use sales, employee, bank, loan, or tds"
        )
