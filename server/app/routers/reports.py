from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.prediction import Prediction
from app.models.report import Report
from app.schemas.prediction import PredictionResponse
from app.schemas.report import ReportCreate, ReportResponse

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get(
    "/predictions",
    response_model=List[PredictionResponse],
    responses={
        401: {"description": "Unauthorized"},
    },
)
async def get_predictions(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    Retrieve all predictions for the authenticated user, ordered newest first.
    """
    predictions = (
        db.query(Prediction)
        .filter(Prediction.user_id == user.id)
        .order_by(Prediction.timestamp.desc())
        .all()
    )
    return predictions


@router.post(
    "/generate",
    response_model=ReportResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        400: {"description": "Validation error"},
        401: {"description": "Unauthorized"},
    },
)
async def generate_report(
    report_data: ReportCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    Create a new report for the current user.
    Optionally, prediction_ids can be a comma-separated list of prediction IDs.
    """
    # Optionally, validate that prediction IDs belong to the user
    if report_data.prediction_ids:
        ids = [int(x.strip()) for x in report_data.prediction_ids.split(",") if x.strip().isdigit()]
        if ids:
            # Verify that all IDs belong to the user (optional security check)
            existing = db.query(Prediction).filter(
                Prediction.id.in_(ids),
                Prediction.user_id == user.id
            ).count()
            if existing != len(ids):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="One or more prediction IDs do not belong to you."
                )

    report = Report(
        user_id=user.id,
        title=report_data.title,
        summary=report_data.summary,
        prediction_ids=report_data.prediction_ids,
    )
    db.add(report)
    db.commit()
    db.refresh(report)

    return ReportResponse(
        id=report.id,
        user_id=report.user_id,
        title=report.title,
        summary=report.summary,
        prediction_ids=report.prediction_ids,
        created_at=report.created_at,
    )


@router.get(
    "/",
    response_model=List[ReportResponse],
    responses={
        401: {"description": "Unauthorized"},
    },
)
async def list_reports(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    List all reports for the authenticated user, newest first.
    """
    reports = (
        db.query(Report)
        .filter(Report.user_id == user.id)
        .order_by(Report.created_at.desc())
        .all()
    )
    return reports


@router.get(
    "/{report_id}",
    response_model=ReportResponse,
    responses={
        404: {"description": "Report not found"},
        401: {"description": "Unauthorized"},
    },
)
async def get_report(
    report_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    Get a specific report by ID, only if it belongs to the current user.
    """
    report = db.query(Report).filter(
        Report.id == report_id,
        Report.user_id == user.id
    ).first()
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")
    return report