const fs = require('fs');

let appCode = fs.readFileSync('src/App.tsx', 'utf-8');
appCode = appCode.replace(
  "import { Plus, ShieldCheck, CheckCircle, Clock, WifiOff, LogIn, LogOut, Cloud, User as UserIcon, Mail, Users, GraduationCap, Menu, X, Search } from 'lucide-react';",
  "import { Plus, ShieldCheck, CheckCircle, Clock, WifiOff, LogIn, LogOut, Cloud, User as UserIcon, Mail, Users, GraduationCap, Menu, X, Search, Trash2 } from 'lucide-react';"
);

fs.writeFileSync('src/App.tsx', appCode);
