# 练习１：根据月份，计算天数.
# month = int(input("请输入月份:"))
# if month < 1 or month > 12:
#   print("输入错误")
# elif month == 2:
#     print("28天")
# elif month == 4 or month == 6 or month == 9 or month == 11:
#   print("30天")
# else:
#   print("31天")

# 方法1:
# month = int(input("请输入月份:"))
# if month < 1 or month > 12:
#   print("输入错误")
# elif month == 2:
#     print("28天")
# elif month in (4,6,9,11):
#   print("30天")
# else:
#   print("31天")
# 方法２:
month = int(input("请输入月份:"))
if month < 1 or month > 12:
  print("输入错误")
else:
  # 将每月天数存入元组
  day_of_month = (31,28,31,30,31,30,31,31,30,31,30,31)
  print(day_of_month[month - 1])
