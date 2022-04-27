import dropbox
import os
import io
import sys

dbx = dropbox.Dropbox(os.environ.get('DROPBOX_ACCESS_TOKEN'))


def read():
    _, res = dbx.files_download("/roster.txt")
    with io.BytesIO(res.content) as stream:
        txt = stream.read().decode()
        print(txt)
        sys.stdout.flush()


def write(txt):
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
    