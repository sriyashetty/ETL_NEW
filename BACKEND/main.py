from fastapi import FastAPI, Depends, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Union
 
from database import SessionLocal
from models import (
    SalesReport,
    EmployeeReport,
    BankAccountSummary,
    LoanDistribution,
    TSTdsLogTdDepMast          # ✅ ADDED
)
from schemas import (
    SalesReportSchema,
    EmployeeReportSchema,
    BankAccountSummarySchema,
    LoanDistributionSchema,
    TSTdsLogTdDepMastSchema   # ✅ ADDED
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
        List[TSTdsLogTdDepMastSchema]  # ✅ ADDED
    ]
)
def generate_report(
    table: str = Query(
        ...,
        description="sales | employee | bank | loan | tds"
    ),
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
 
    elif table == "tds":  # ✅ NEW
        return db.query(TSTdsLogTdDepMast).all()
 
    else:
        raise HTTPException(
            status_code=400,
            detail="Invalid table name. Use sales, employee, bank, loan, or tds"
        )