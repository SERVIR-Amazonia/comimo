# Generated by Django 3.1.7 on 2021-05-20 16:41

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0005_auto_20210519_1534'),
        ('subscribe', '0015_auto_20210504_1620'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserMinesModel',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('y', models.FloatField()),
                ('x', models.FloatField()),
                ('reported_date', models.DateTimeField(blank=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accounts.profile')),
            ],
            options={
                'db_table': 'gmw_usermines',
            },
        ),
    ]