# Generated by Django 3.1.7 on 2021-03-22 22:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('subscribe', '0008_cronjobs'),
    ]

    operations = [
        migrations.AddField(
            model_name='cronjobs',
            name='job_type',
            field=models.CharField(default='test', max_length=20),
            preserve_default=False,
        ),
    ]