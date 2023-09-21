# Bed

## Schema

Journal Schema

```sql
content varchar(255) NO
date date NO PRI
title varchar(255) YES
timestamp timestamp YES
user varchar(255) YES
imageURL varchar(255) YES
```

User Schema

```sql
id int NO PRI auto_increment
name varchar(255) NO
email varchar(255) NO
timestamp timestamp YES
```
