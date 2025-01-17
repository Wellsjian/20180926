"""
  str 字面值
  练习:exercise04.py
"""

# 双引号
name01 = "苏大强"
# 单引号
name01 = '苏大强'
# 三引号:可见即所得
name01 = '''苏大强'''
name01 = """
            苏
            大
            强
          """
print(name01)

# 单引号内的双引号不算结束符
message = '我叫"苏大强".'

# 转义符:改变原始字符的含义
# \"  \'   \"""   \\  \n   \t
message = "我叫\"苏大强\"."

message = """我叫\"""苏大强."""
# 字符串字面值可以直接拼接
message = "我叫""大强"

path = "D:\\aid1904\\bay02"
path = r"D:\aid1904\bay02"
# 换行    tab键(水平制表格)
message = "我\n叫\t大强"
print(message)

# 字符串格式化
num01, num02 = 1, 2
# 需求:在字符串中,插入变量.
# 做法1:字符串拼接
s01 = "请计算" + str(num01) + " + " + str(num02) + " = ?"
# 做法2:占位符
# %d 占位符
s01 = "请计算%s+%d=?" % (num01, num02)
print(s01)

print("我%d你"%(5))# 我5你
print("我%-3d你"%(5))# 我5  你
print("我%03d你"%(5))# 我005你
print("%.2f"%(1.2355)) # 1.24
