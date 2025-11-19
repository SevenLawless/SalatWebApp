// Arabic translations
export const ar = {
  // Auth
  'signUp.title': 'إنشاء حساب',
  'signUp.subtitle': 'سجل للبدء في تتبع صلواتك',
  'signUp.username': 'اسم المستخدم',
  'signUp.usernamePlaceholder': 'أدخل اسم المستخدم',
  'signUp.phoneNumber': 'رقم الهاتف',
  'signUp.phonePlaceholder': 'أدخل رقم الهاتف',
  'signUp.password': 'كلمة المرور',
  'signUp.passwordPlaceholder': 'أدخل كلمة المرور',
  'signUp.confirmPassword': 'تأكيد كلمة المرور',
  'signUp.confirmPasswordPlaceholder': 'أكد كلمة المرور',
  'signUp.button': 'إنشاء حساب',
  'signUp.creating': 'جاري إنشاء الحساب...',
  'signUp.haveAccount': 'لديك حساب بالفعل؟',
  'signUp.signIn': 'تسجيل الدخول',
  
  'signIn.title': 'مرحباً بعودتك',
  'signIn.subtitle': 'سجل الدخول لمتابعة تتبع صلواتك',
  'signIn.phoneNumber': 'رقم الهاتف',
  'signIn.phonePlaceholder': 'أدخل رقم الهاتف',
  'signIn.password': 'كلمة المرور',
  'signIn.passwordPlaceholder': 'أدخل كلمة المرور',
  'signIn.button': 'تسجيل الدخول',
  'signIn.signingIn': 'جاري تسجيل الدخول...',
  'signIn.noAccount': 'ليس لديك حساب؟',
  'signIn.signUp': 'إنشاء حساب',
  
  // Validation errors
  'error.usernameRequired': 'اسم المستخدم مطلوب',
  'error.usernameMinLength': 'يجب أن يكون اسم المستخدم على الأقل حرفين',
  'error.phoneRequired': 'رقم الهاتف مطلوب',
  'error.phoneInvalid': 'يرجى إدخال رقم هاتف صحيح',
  'error.passwordRequired': 'كلمة المرور مطلوبة',
  'error.passwordMinLength': 'يجب أن تكون كلمة المرور على الأقل 6 أحرف',
  'error.passwordsNotMatch': 'كلمات المرور غير متطابقة',
  'error.invalidCredentials': 'رقم الهاتف أو كلمة المرور غير صحيحة',
  'error.serverError': 'حدث خطأ في الخادم',
  'error.networkError': 'خطأ في الاتصال. يرجى التحقق من اتصالك',
  
  // Navbar
  'navbar.brand': 'متتبع الصلاة',
  'navbar.tracker': 'متتبع الصلاة',
  'navbar.statistics': 'الإحصائيات',
  'navbar.logout': 'تسجيل الخروج',
  
  // Prayer Tracker
  'tracker.title': 'الصلوات اليومية',
  'tracker.today': 'اليوم',
  'tracker.viewingPastDate': 'عرض تاريخ سابق',
  'tracker.previousDay': 'اليوم السابق',
  'tracker.nextDay': 'اليوم التالي',
  'tracker.loading': 'جاري تحميل أوقات الصلاة...',
  'tracker.error': 'فشل تحميل بيانات الصلاة. يرجى المحاولة مرة أخرى',
  'tracker.saveError': 'فشل حفظ سجل الصلاة. يرجى المحاولة مرة أخرى',
  
  // Prayer names
  'prayer.fajr': 'الفجر',
  'prayer.dhuhr': 'الظهر',
  'prayer.asr': 'العصر',
  'prayer.maghrib': 'المغرب',
  'prayer.isha': 'العشاء',
  
  // Prayer states
  'prayer.notPrayed': 'لم يُصل',
  'prayer.prayed': 'صلى',
  'prayer.missed': 'فاتته',
  
  // Statistics
  'statistics.title': 'إحصائيات الصلاة',
  'statistics.apply': 'تطبيق',
  'statistics.lastWeek': 'الأسبوع الماضي',
  'statistics.lastMonth': 'الشهر الماضي',
  'statistics.totalPrayers': 'إجمالي الصلوات',
  'statistics.prayersCounted': 'صلاة محسوبة',
  'statistics.totalPrayed': 'إجمالي ما تم صلاته',
  'statistics.prayersCompleted': 'صلاة مكتملة',
  'statistics.totalMissed': 'إجمالي ما فات',
  'statistics.prayersMissed': 'صلاة فاتت',
  'statistics.completionRate': 'معدل الإتمام',
  'statistics.overallCompletion': 'الإتمام الإجمالي',
  'statistics.daysTracked': 'الأيام المتتبعة',
  'statistics.daysInPeriod': 'أيام في الفترة',
  'statistics.dailyBreakdown': 'التفصيل اليومي',
  'statistics.noRecords': 'لا توجد سجلات صلاة لهذه الفترة',
  'statistics.loading': 'جاري تحميل الإحصائيات...',
  'statistics.error': 'فشل تحميل الإحصائيات. يرجى المحاولة مرة أخرى',
};

// Get translation function
export const t = (key) => {
  return ar[key] || key;
};

