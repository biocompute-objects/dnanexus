from typing import Dict
import requests
import json

class CustomBcoDB():
    def __init__(self, host_url: str, credentials: dict):
        self.__host_url__ = host_url
        self.__credentials__ = credentials

    def upload(self) -> Dict[str, str]:
        try:
            with open("app/schemas/biocompute_export.json", "r") as file:
                file_content = json.load(file)

            headers = {
                "Content-type": "application/json; charset=UTF-8",
            }

            if self.__credentials__ and len(self.__credentials__) > 0:
                headers.update(self.__credentials__)

            response = requests.post(
                url=self.__host_url__,
                data=json.dumps({ "contents": file_content }),
                headers=headers
            )
            
            if response.status_code == 200:
                print("File uploaded to Custom BCO DB")
                return {
                    "code": 200,
                    "message": "File uploaded to Custom BCO DB",
                }
            else:
                print("Failed to update file to Custom BCO DB", response.__dict__)
                return {
                    "code": response.status_code,
                    "message": "Failed to update file to Custom BCO DB"
                }
        except Exception as e:
            print(f"Error uploading to Custom BCO DB -- {repr(e)}")
            return {
                "code": 500,
                "message": "Internal server error"
            }
