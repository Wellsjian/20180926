# -*- coding: utf-8 -*-
# Generated by Django 1.11.8 on 2019-07-17 08:29
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('my_bookstore', '0003_auto_20190717_0801'),
    ]

    operations = [
        migrations.CreateModel(
            name='Author',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, verbose_name='名字')),
                ('age', models.IntegerField(default=0, verbose_name='年龄')),
                ('emill', models.EmailField(default='wangfj@163.com', max_length=254, verbose_name='邮箱')),
            ],
        ),
        migrations.CreateModel(
            name='Wife',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, verbose_name='姓名')),
                ('author', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='my_bookstore.Author')),
            ],
        ),
        migrations.AlterModelTable(
            name='book',
            table=None,
        ),
    ]
