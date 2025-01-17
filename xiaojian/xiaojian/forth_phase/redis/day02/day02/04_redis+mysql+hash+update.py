'''update数据(mysql)后,同步到redis缓存'''
import redis
import pymysql


def update_mysql(age,username):
  db = pymysql.connect('127.0.0.1','root','123456','userdb',charset='utf8')
  cursor = db.cursor()
  upd = 'update user set age=%s where username=%s'
  try:
    # code: 0 或者 1
    code = cursor.execute(upd,[age,username])
    db.commit()
    if code == 1:
      return True

  except Exception as e:
    db.rollback()
    print('Error',e)
  cursor.close()
  db.close()


def update_redis(age):
  r = redis.Redis(host='127.0.0.1',port=6379,db=0)
  r.hset('user','age',age)
  print('已同步到redis')
  # 设置过期时间
  r.expire('user',30)
  # 测试
  print(r.hget('user','age'))


if __name__ == '__main__':
  username = input('请输入用户名:')
  age = input('请输入更改后的年龄:')
  if update_mysql(age,username):
    update_redis(age)
  else:
    print('用户名有误')




























