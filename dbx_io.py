import dropbox
import os
import io
import sys

REFRESH_TOKEN=os.environ.get('DROPBOX_REFRESH_TOKEN')
APP_KEY=os.environ.get("DROPBOX_APP_KEY")

def read():
    with dropbox.Dropbox(oauth2_refresh_token=REFRESH_TOKEN, app_key=APP_KEY) as dbx:
        _, res = dbx.files_download("/roster.txt")
        with io.BytesIO(res.content) as stream:
            txt = stream.read().decode()
            print(txt)
            sys.stdout.flush()


def write(txt):
    with dropbox.Dropbox(oauth2_refresh_token=REFRESH_TOKEN, app_key=APP_KEY) as dbx:
        with io.BytesIO(txt.encode()) as stream:
            stream.seek(0)
            dbx.files_upload(stream.read(), "/roster.txt", mode=dropbox.files.WriteMode.overwrite)



if (sys.argv[1] == "read"):
    read()
else:
    roster = ""
    if (len(sys.argv) > 2):
        roster = sys.argv[2]
    write(roster)
    