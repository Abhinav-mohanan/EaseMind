from celery import shared_task

@shared_task
def send_welcome_msg(username):
    print(f'Sending welcom email to {username}')
    return f'email sent to {username}'