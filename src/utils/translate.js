export const translate = {
	errors: {
		required: "این فیلد الزامی است.",
		phone: "شماره همراه معتبر نیست.",
		repassword: "رمزهای عبور باید مطابقت داشته باشند",
	},
	notify: {
		entranceSuccess: "ورود باموفقیت انجام شد.",
		sendOtpSucceed: "کد اعتبار سنجی برای شما ارسال شد",
	},
};

const keys_translation = {
	"id": "آیدی",
	"create_at": "زمان ایجاد",
	"updated_at": "زمان آخرین بروزرسانی",
	"last_modified_by": "آخرین تغییر توسط",
	"last_modified_by_id": "آخرین تغییر توسط",
	"is_deleted": "پاک شده",
	"deleted_at": "زمان حذف",
	"customer": "آیدی مشتری",
	"customer_id": "آیدی مشتری",
	"country": "کشور",
	"state": "استان",
	"city": "شهر",
	"street": "خیابان",
	"full_address": "آدرس کامل",
	"mobile_number": "شماره موبایل",
	"full_name": "نام و نام خانوادگی",
	"customer_code": "کد مشتری",
	"national_code": "کد ملی",
	"marketer": "بازاریاب",
	"plate_number": "شماره پلاک",
	"name": "نام",
	"weight": "وزن",
	"price": "قیمت",
	"tax": "درصد مالیات",
	"last_login": "آخرین ورود",
	"username": "نام کاربری",
	"first_name": "نام",
	"last_name": "نام خانوادگی",
	"is_active": "فعال بودن حساب",
	"date_joined": "تاریخ عضویت",
	"type": "نوع",
	"factor": "آیدی فاکتور",
	"factor_id": "آیدی فاکتور",
	"product": "آیدی محصول",
	"product_id": "آیدی محصول",
	"count": "تعداد",
	"tracking_code": "کد پیگیری",
	"address": "آیدی آدرس",
	"address_id": "آیدی آدرس",
	"factor_date": "تاریخ فاکتور",
	"discount_is_percent": "درصدی بودن تخفیف",
	"discount_value": "مقدار تخفیف",
	"is_accepted": "تایید شده",
	"description": "توضیحات",
	"payment_status": "وضعیت پرداخت",
	"store": "آیدی انبار",
	"store_id": "آیدی انبار",
	"permission_for_accept": "افرادی که میتوانند تایید کنند",
	"payment_amount": "مقدار قابل پرداخت",
	"driver": "آیدی راننده",
	"amount": "مقدار",
	"payment_type": "نوع پرداخت",
	"payment_date": "زمان پرداخت",
};

export const translateKeys = (obj, map = keys_translation) => {
	if (typeof obj !== "object" || obj === null) {
		return obj;
	}

	if (Array.isArray(obj)) {
		return obj.map((item) => translateKeys(item, map));
	}

	const translatedObj = {};
	for (const key in obj) {
		if (obj.hasOwnProperty(key)) {
			const translatedKey = map[key] || key;
			translatedObj[translatedKey] = translateKeys(obj[key], map);
		}
	}

	return translatedObj;
};
