from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_pointers():
    return {"message": "List of pointers"}

@router.post("/")
def create_pointer():
    return {"message": "Pointer created"}
