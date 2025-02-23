

from database.firebase_utils import send_push_notification


class NotificationService:
    def __init__(self):
        pass

    async def meeting_creation_to_client(self, client_id, worker_full_name, date_meeting, time_start, meeting_id):
        """
        Send a push notification to the client when a meeting is created.

        :param client_id: UUID of the client
        :param worker_full_name: Full name of the worker
        :param date_meeting: Date of the meeting
        :param time_start: Start time of the meeting
        :param meeting_id: UUID of the meeting
        :return None
        """
        data = {
            "receiver_id": client_id,
            "title": f"A meeting was created by {worker_full_name}",
            "message": f"Meeting with {worker_full_name} on {date_meeting} at {time_start} have been created.",
            "link": f"/meetings/{meeting_id}"
        }
        return await send_push_notification(**data)

    async def meeting_accepted_to_worker(self, worker, meeting):
        """
        Send a push notification to the client when a meeting is created.

        :param worker: the worker object
        :param date_meeting: Date of the meeting
        :param time_start: Start time of the meeting
        :param meeting_id: UUID of the meeting
        :return None
        """
        worker = worker.to_dict()
        worker_full_name=f"{worker["user"].first_name} {worker["user"].last_name}",
        date_meeting=meeting["date_meeting"],
        time_start=meeting["time_start"],
        meeting_id=meeting["id"]

        data = {
            "receiver_id": worker["id"],
            "title": f"A meeting was accepted by {worker_full_name}",
            "message": f"Meeting with {worker_full_name} on {date_meeting} at {time_start} have been accepted.",
            "link": f"/meetings/{meeting_id}"
        }
        return await send_push_notification(**data)

    async def meeting_rejected_to_worker(self, worker, meeting):
        """
        Send a push notification to the client when a meeting is created.

        :param worker: the worker object
        :param date_meeting: Date of the meeting
        :param time_start: Start time of the meeting
        :param meeting_id: UUID of the meeting
        :return None
        """
        worker = worker.to_dict()
        worker_full_name=f"{worker["user"].first_name} {worker["user"].last_name}",
        date_meeting=meeting["date_meeting"],
        time_start=meeting["time_start"],
        meeting_id=meeting["id"]
        data = {
            "receiver_id": worker["id"],
            "title": f"A meeting was rejected by {worker_full_name}",
            "message": f"Meeting with {worker_full_name} on {date_meeting} at {time_start} have been rejected.",
            "link": f"/meetings/{meeting_id}"
        }
        return await send_push_notification(**data)
