import re, sys

path = sys.argv[1]
with open(path, 'r') as f:
    lines = f.readlines()

skip = {'useCountUp', 'useC', 'clsx'}
out = []
for line in lines:
    out.append(line)
    m = re.match(r'^function ([A-Z]\w*)\s*\([^)]*\)\s*\{', line)
    if m and m.group(1) not in skip:
        out.append('  const C = useC();\n')

with open(path, 'w') as f:
    f.writelines(out)

print(f'Done: {len(out)} lines')
