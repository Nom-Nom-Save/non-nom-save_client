import { StringKey } from './string-key.consts';

export const enMessages: Record<StringKey, string> = {
  // Login and Register
  [StringKey.LOGIN_TO_YOUR_ACCOUNT]: 'Log in to your account',
  [StringKey.SING_UP]: 'Sign Up',
  [StringKey.DONT_HAVE_AN_ACCOUNT]: "Don't have an account?",
  [StringKey.FORGOT_PASSWORD]: 'Forgot Password',
  [StringKey.FORGOT_PASSWORD_DESCRIPTION]:
    "No worries, it happens! Enter your email address and we'll send you a code to reset your password.",
  [StringKey.BACK]: 'Back',
  [StringKey.CREATE_YOUR_ACCOUNT]: 'Create your account',
  [StringKey.BUSINESS]: 'Business',
  [StringKey.OR]: 'or',
  [StringKey.CONTINUE_WITH_GOOGLE]: 'Continue with Google',
  [StringKey.ALREADY_HAVE_AN_ACCOUNT]: 'Already have an account?',
  [StringKey.SIGN_IN]: 'Sign In',
  [StringKey.ENTER_FOUR_DIGIT_CODE]: 'Enter the 4-digit code sent to',
  [StringKey.VERIFY_RESET_CODE]: 'Verify reset code',
  [StringKey.SET_NEW_PASSWORD]: 'Set new password',
  [StringKey.CHOOSE_A_STRONG_PASSWORD]: 'Choose a strong password for your account.',
  [StringKey.BACK_TO_REGISTER]: 'Back to registration',
  [StringKey.WE_SENT_FOUR_DIGIT_CODE]: 'We sent a 4-digit code to',
  [StringKey.ENTER_IT_BELOW_TO_ACTIVATE]: 'Enter it below to activate your account.',
  [StringKey.DIDNT_RECEIVE_THE_CODE]: "Didn't receive the code?",
  [StringKey.RESEND]: 'Resend',

  // Forgot Password Form
  [StringKey.EMAIL_ADDRESS]: 'Email Address',
  [StringKey.EMAIL_PLACEHOLDER]: 'hello@nomnomsave.com',
  [StringKey.SEND_RESET_CODE]: 'Send Reset Code',
  [StringKey.SENDING]: 'Sending…',
  [StringKey.BACK_TO_LOGIN]: '← Back to Login',
  [StringKey.ACCOUNT_NOT_FOUND]: 'Account not found.',
  [StringKey.ACCOUNT_NOT_FOUND_DESCRIPTION]: 'No account found for this email address.',
  [StringKey.FAILED_TO_SEND_RESET_CODE]: 'Failed to send reset code.',
  [StringKey.FAILED_TO_SEND_RESET_CODE_DESCRIPTION]:
    'Please check your email address and try again.',

  // Reset Password Form
  [StringKey.RESET_CODE]: 'Reset Code',
  [StringKey.RESET_CODE_ERROR]: 'Please enter the correct 4-digit code from your email.',
  [StringKey.VERIFYING]: 'Verifying…',
  [StringKey.VERIFY_CODE]: 'Verify Code',
  [StringKey.INVALID_CODE]: 'Invalid code.',
  [StringKey.INVALID_CODE_DESCRIPTION]: 'Please enter the full 4-digit code from your email.',
  [StringKey.INVALID_OR_EXPIRED_CODE]: 'Invalid or expired code.',
  [StringKey.INVALID_OR_EXPIRED_CODE_DESCRIPTION]: 'Please check the code and try again.',
  [StringKey.VERIFICATION_FAILED]: 'Verification failed.',
  [StringKey.VERIFICATION_FAILED_DESCRIPTION]: 'Something went wrong. Please try again.',
  [StringKey.NEW_PASSWORD]: 'New Password',
  [StringKey.CONFIRM_PASSWORD]: 'Confirm Password',
  [StringKey.PASSWORD_PLACEHOLDER]: '••••••••',
  [StringKey.HIDE_PASSWORD]: 'Hide password',
  [StringKey.SHOW_PASSWORD]: 'Show password',
  [StringKey.RESETTING]: 'Resetting…',
  [StringKey.RESET_PASSWORD]: 'Reset Password',
  [StringKey.PASSWORD_RESET_SUCCESS]: 'Password reset!',
  [StringKey.PASSWORD_RESET_SUCCESS_DESCRIPTION]: 'Your password has been changed. Please sign in.',
  [StringKey.RESET_FAILED]: 'Reset failed.',
  [StringKey.RESET_FAILED_DESCRIPTION]: 'Something went wrong. Please try again.',

  // Login Form
  [StringKey.LOGIN_EMAIL_PLACEHOLDER]: 'name@example.com',
  [StringKey.PASSWORD]: 'Password',
  [StringKey.FORGOT_PASSWORD_LINK]: 'Forgot Password?',
  [StringKey.SIGNING_IN]: 'Signing in…',
  [StringKey.LOGIN]: 'Login',
  [StringKey.INVALID_CREDENTIALS]: 'Invalid credentials.',
  [StringKey.INVALID_CREDENTIALS_DESCRIPTION]: 'Please check your email and password.',
  [StringKey.EMAIL_NOT_VERIFIED]: 'Email not verified.',
  [StringKey.EMAIL_NOT_VERIFIED_DESCRIPTION]: 'Please verify your email before signing in.',
  [StringKey.LOGIN_FAILED]: 'Login failed.',
  [StringKey.LOGIN_FAILED_DESCRIPTION]: 'Something went wrong. Please try again.',

  // Login Left Panel
  [StringKey.WELCOME_BACK]: 'Welcome Back',
  [StringKey.FEATURE_DISCOUNTS]: '70% Discounts on Surplus',
  [StringKey.FEATURE_REAL_TIME]: 'Real-time Local Offers',
  [StringKey.FEATURE_MAP]: 'Premium Map Access',
  [StringKey.LOGIN_TAGLINE]: 'Saving the planet, one delicious bite at a time.',

  // Registration Forms (shared)
  [StringKey.CREATING_ACCOUNT]: 'Creating account…',
  [StringKey.CREATE_ACCOUNT]: 'Create Account',
  [StringKey.EMAIL_ALREADY_IN_USE]: 'Email already in use.',
  [StringKey.EMAIL_ALREADY_IN_USE_DESCRIPTION]: 'An account with this email already exists.',
  [StringKey.REGISTRATION_FAILED]: 'Registration failed.',
  [StringKey.REGISTRATION_FAILED_DESCRIPTION]: 'Something went wrong. Please try again.',
  [StringKey.AGREEMENT_REQUIRED]: 'Agreement required.',
  [StringKey.AGREEMENT_REQUIRED_DESCRIPTION]:
    'You must agree to the Terms of Service and Privacy Policy to continue.',
  [StringKey.REGISTRATION_FIELDS_ERROR]: 'Please check the form fields.',
  [StringKey.BY_JOINING_AGREE]: 'By joining, you agree to our',
  [StringKey.TERMS_OF_SERVICE]: 'Terms of Service',
  [StringKey.AND]: 'and',
  [StringKey.PRIVACY_POLICY]: 'Privacy Policy',

  // Business Form
  [StringKey.BUSINESS_NAME]: 'Business Name',
  [StringKey.BUSINESS_NAME_PLACEHOLDER]: 'Nom Nom Store',
  [StringKey.BUSINESS_EMAIL_PLACEHOLDER]: 'cafe@example.com',
  [StringKey.STORE_ADDRESS]: 'Store Address',
  [StringKey.STORE_ADDRESS_PLACEHOLDER]: '123 Main St, Kyiv, Ukraine',

  // Buyer Form
  [StringKey.FULL_NAME]: 'Full Name',
  [StringKey.FULL_NAME_PLACEHOLDER]: 'Boss Molokosos',
  [StringKey.BUYER_EMAIL_PLACEHOLDER]: 'john@example.com',

  // Registration Left Panel
  [StringKey.JOIN_COMMUNITY_BUYER]: 'Join the community',
  [StringKey.JOIN_COMMUNITY_BUSINESS]: 'Join the community saving food every day',
  [StringKey.FEATURE_DISCOUNTS_SHORT]: '70% Discounts',
  [StringKey.FEATURE_REAL_TIME_SHORT]: 'Real-time offers',

  // Verify Email Left Panel
  [StringKey.ALMOST_THERE_LINE1]: 'Almost',
  [StringKey.ALMOST_THERE_LINE2]: 'there!',
  [StringKey.VERIFY_EMAIL_LEFT_PANEL_DESCRIPTION]:
    "Check your inbox - we've sent a 4-digit code to confirm your email address.",

  // Verify Email Form
  [StringKey.EMAIL_VERIFIED]: 'Email verified!',
  [StringKey.ACCOUNT_IS_READY]: 'Your account is ready. Please sign in.',
  [StringKey.VERIFICATION_CODE]: 'Verification Code',
  [StringKey.VERIFY_EMAIL_CODE_ERROR]: 'Please enter the correct 4-digit code from your email.',
  [StringKey.VERIFYING_EMAIL]: 'Verifying…',
  [StringKey.VERIFY_EMAIL]: 'Verify Email',
  [StringKey.INVALID_CODE_SHORT]: 'Invalid code.',
  [StringKey.INVALID_CODE_SHORT_DESCRIPTION]: 'Please enter the full 4-digit code.',

  // Authentication Validation
  [StringKey.VALID_EMAIL]: 'Please enter a valid email address',
  [StringKey.PASSWORD_REQUIRED]: 'Password is required',
  [StringKey.PASSWORD_MIN]: 'Password must be at least 8 characters',
  [StringKey.PASSWORD_MAX]: 'Password must be less than 100 characters',
  [StringKey.PASSWORDS_DO_NOT_MATCH]: 'Passwords do not match',
  [StringKey.BUSINESS_NAME_MIN]: 'Business name must be at least 2 characters',
  [StringKey.BUSINESS_NAME_MAX]: 'Business name must be less than 100 characters',
  [StringKey.ADDRESS_MIN]: 'Please enter a valid address',
  [StringKey.ADDRESS_MAX]: 'Address must be less than 200 characters',
  [StringKey.AGREE_TO_TERMS_REQUIRED]:
    'You must agree to the Terms of Service and Privacy Policy to continue.',
  [StringKey.FULL_NAME_MIN]: 'Full name must be at least 2 characters',
  [StringKey.FULL_NAME_MAX]: 'Full name must be less than 100 characters',
  [StringKey.CODE_LENGTH]: 'Code must be 4 digits',
  [StringKey.CODE_DIGITS_ONLY]: 'Code must contain digits only',

  // Establishment Navbar
  [StringKey.TEMPLATES]: 'Templates',
  [StringKey.MENU]: 'Menu',
  [StringKey.SETTINGS]: 'Settings',
  [StringKey.ANALYTICS]: 'Analytics',
  [StringKey.LOGOUT]: 'Log out',
  [StringKey.QUICK_SEARCH]: 'Quick search...',

  // Templates Page
  [StringKey.NEW_PRODUCT]: 'New Product',
  [StringKey.NEW_BOX]: 'New Box',
  [StringKey.PRODUCTS]: 'Products',
  [StringKey.BOXES]: 'Boxes',
  [StringKey.ALL_TYPES]: 'All types',
  [StringKey.NO_IMAGE]: 'No image',
  [StringKey.EDIT]: 'Edit',
  [StringKey.PUBLISH]: 'Publish',
  [StringKey.DELETE]: 'Delete',
  [StringKey.PUBLISHED]: 'Published',
  [StringKey.DRAFT]: 'Draft',
  [StringKey.QTY]: 'Qty',
  [StringKey.EXP]: 'Exp',
  [StringKey.NO_PRODUCTS]: 'No products yet',
  [StringKey.CREATE_FIRST_PRODUCT]: 'Create your first product template to get started.',
  [StringKey.NO_BOXES]: 'No boxes yet',
  [StringKey.CREATE_FIRST_BOX]: 'Create your first box template to get started.',

  // Product/Box Dialog
  [StringKey.CREATE_PRODUCT]: 'Create Product',
  [StringKey.EDIT_PRODUCT]: 'Edit Product',
  [StringKey.CREATE_BOX]: 'Create Box',
  [StringKey.EDIT_BOX]: 'Edit Box',
  [StringKey.NAME]: 'Name',
  [StringKey.DESCRIPTION]: 'Description',
  [StringKey.ORIGINAL_PRICE]: 'Original Price',
  [StringKey.QUANTITY]: 'Quantity',
  [StringKey.PRODUCT_TYPE]: 'Product Type',
  [StringKey.BOX_TYPE]: 'Box Type',
  [StringKey.SELECT_TYPE]: 'Select type',
  [StringKey.EXPIRATION_DATE]: 'Expiration Date',
  [StringKey.SAVING]: 'Saving…',
  [StringKey.SAVE_CHANGES]: 'Save Changes',
  [StringKey.PRODUCT_CREATED]: 'Product created successfully!',
  [StringKey.PRODUCT_UPDATED]: 'Product updated successfully!',
  [StringKey.BOX_CREATED]: 'Box created successfully!',
  [StringKey.BOX_UPDATED]: 'Box updated successfully!',
  [StringKey.FAILED_TO_CREATE_PRODUCT]: 'Failed to create product.',
  [StringKey.FAILED_TO_UPDATE_PRODUCT]: 'Failed to update product.',
  [StringKey.FAILED_TO_CREATE_BOX]: 'Failed to create box.',
  [StringKey.FAILED_TO_UPDATE_BOX]: 'Failed to update box.',

  // Publish Dialog
  [StringKey.PUBLISH_TO_MENU]: 'Publish to Menu',
  [StringKey.PUBLISHING_ITEM]: 'Publishing item',
  [StringKey.DISCOUNT_PRICE]: 'Discount Price',
  [StringKey.START_TIME]: 'Start Time',
  [StringKey.END_TIME]: 'End Time',
  [StringKey.PUBLISHING]: 'Publishing…',
  [StringKey.PUBLISHED_TO_MENU]: 'Published to menu successfully!',
  [StringKey.FAILED_TO_PUBLISH]: 'Failed to publish to menu.',

  // Delete Dialog
  [StringKey.CONFIRM_DELETE]: 'Confirm Delete',
  [StringKey.DELETE_CONFIRMATION]: 'Are you sure you want to delete',
  [StringKey.CANCEL]: 'Cancel',
  [StringKey.DELETING]: 'Deleting…',
  [StringKey.DELETED_SUCCESSFULLY]: 'Deleted successfully!',
  [StringKey.FAILED_TO_DELETE]: 'Failed to delete.',

  // Validation (establishment)
  [StringKey.ITEM_NAME_MIN]: 'Name must be at least 2 characters',
  [StringKey.ITEM_NAME_MAX]: 'Name must be less than 100 characters',
  [StringKey.DESCRIPTION_MIN]: 'Description must be at least 10 characters',
  [StringKey.DESCRIPTION_MAX]: 'Description must be less than 500 characters',
  [StringKey.PRICE_POSITIVE]: 'Price must be greater than 0',
  [StringKey.EXPIRATION_REQUIRED]: 'Expiration date is required',
  [StringKey.QUANTITY_MIN]: 'Quantity must be at least 1',
  [StringKey.START_TIME_REQUIRED]: 'Start time is required',
  [StringKey.END_TIME_REQUIRED]: 'End time is required',
  [StringKey.END_TIME_AFTER_START]: 'End time must be after start time',
  [StringKey.CLOSE_TIME_AFTER_OPEN]: 'Closing time must be after opening time',

  // Menu Page
  [StringKey.STATUS_ACTIVE]: 'Active',
  [StringKey.STATUS_SOLD_OUT]: 'Sold Out',
  [StringKey.STATUS_INACTIVE]: 'Inactive',
  [StringKey.ALL_STATUSES]: 'All statuses',
  [StringKey.ACTIVE_ITEMS]: 'active',
  [StringKey.SOLD_OUT_ITEMS]: 'sold out',
  [StringKey.INACTIVE_ITEMS]: 'inactive',
  [StringKey.AVAILABLE]: 'Available',
  [StringKey.PAUSE]: 'Pause',
  [StringKey.RESUME]: 'Resume',
  [StringKey.DEACTIVATE]: 'Deactivate',
  [StringKey.EDIT_MENU_ITEM]: 'Edit Menu Item',
  [StringKey.ITEM_PAUSED]: 'Item paused.',
  [StringKey.ITEM_RESUMED]: 'Item resumed.',
  [StringKey.ITEM_DEACTIVATED]: 'Item deactivated.',
  [StringKey.MENU_ITEM_UPDATED]: 'Menu item updated.',
  [StringKey.FAILED_TO_UPDATE_STATUS]: 'Failed to update status.',
  [StringKey.FAILED_TO_UPDATE_MENU_ITEM]: 'Failed to update menu item.',
  [StringKey.NO_MENU_ITEMS]: 'No menu items yet',
  [StringKey.PUBLISH_FROM_TEMPLATES]: 'Publish items from Templates to see them here.',
  [StringKey.UPDATING]: 'Updating…',

  // Settings Page
  [StringKey.PROFILE_INFORMATION]: 'Profile Information',
  [StringKey.WORKING_HOURS]: 'Working Hours',
  [StringKey.CHANGE_PASSWORD]: 'Change Password',
  [StringKey.DELETE_ACCOUNT]: 'Delete Account',
  [StringKey.DELETE_ACCOUNT_WARNING]:
    'Once you delete your account, there is no going back. This action is permanent.',
  [StringKey.PHONE]: 'Phone',
  [StringKey.PROFILE_UPDATED]: 'Profile updated successfully!',
  [StringKey.FAILED_TO_UPDATE_PROFILE]: 'Failed to update profile.',
  [StringKey.CURRENT_PASSWORD]: 'Current Password',
  [StringKey.COMING_SOON]: 'Coming Soon',
  [StringKey.SAVE_HOURS]: 'Save Hours',
  [StringKey.HOURS_UPDATED]: 'Working hours updated!',
  [StringKey.FAILED_TO_UPDATE_HOURS]: 'Failed to update working hours.',
  [StringKey.CLOSED]: 'Closed',
  [StringKey.MONDAY]: 'Monday',
  [StringKey.TUESDAY]: 'Tuesday',
  [StringKey.WEDNESDAY]: 'Wednesday',
  [StringKey.THURSDAY]: 'Thursday',
  [StringKey.FRIDAY]: 'Friday',
  [StringKey.SATURDAY]: 'Saturday',
  [StringKey.SUNDAY]: 'Sunday',

  // Impact Stats
  [StringKey.MEALS_SAVED]: 'Meals Saved',
  [StringKey.CO2_PREVENTED]: 'CO₂ Prevented',
  [StringKey.REVENUE_GENERATED]: 'Revenue Generated',
  [StringKey.BAGS_SOLD]: 'Bags sold',
  [StringKey.FOOD_SAVED]: 'Food saved',
  [StringKey.YOUR_IMPACT]: 'Your Impact',

  // Templates Page (additional)
  [StringKey.TEMPLATES_LIBRARY]: 'Templates Library',
  [StringKey.TEMPLATES_LIBRARY_DESCRIPTION]:
    'Manage reusable products and Magic Boxes. Publish them to your menu with one click.',
  [StringKey.MAGIC_BOXES]: 'Magic Boxes',
  [StringKey.REC_PRICE]: 'Rec. price',
  [StringKey.MENU_PRICE]: 'Menu price',
  [StringKey.PUBLISH_TO_MENU_BTN]: 'Publish to Menu',

  // Menu Page (additional)
  [StringKey.ACTIVE_MENU]: 'Active Menu',
  [StringKey.ACTIVE_MENU_DESCRIPTION]: 'Items currently published and visible to customers.',
  [StringKey.PICKUP_WINDOW]: 'Pickup window',
  [StringKey.DISCOUNT]: 'Discount',
  [StringKey.OFF]: 'off',

  // Working Hours Table
  [StringKey.DAY]: 'Day',
  [StringKey.OPENS]: 'Opens',
  [StringKey.CLOSES]: 'Closes',
  [StringKey.OPEN]: 'Open',
  [StringKey.TODAY]: 'Today',

  // Multi-select
  [StringKey.ALL_SELECTED]: 'All selected',

  // Change Password Placeholders
  [StringKey.ENTER_CURRENT_PASSWORD]: 'Enter current password',
  [StringKey.PASSWORD_MIN_HINT]: 'Min. 8 characters',
  [StringKey.REPEAT_NEW_PASSWORD]: 'Repeat new password',

  // Brand Images
  [StringKey.BRANDING]: 'Branding',
  [StringKey.BRAND_IMAGES]: 'Brand Images',
  [StringKey.LOGO_URL]: 'Logo URL',
  [StringKey.BANNER_URL]: 'Banner URL',

  // Settings Page (additional)
  [StringKey.YOUR_ESTABLISHMENT]: 'Your establishment',
  [StringKey.ESTABLISHMENT_PROFILE]: 'Establishment Profile',
  [StringKey.ESTABLISHMENT_PROFILE_DESCRIPTION]:
    'Manage how your establishment appears to customers on Nom Nom Save.',
  [StringKey.BASIC_INFORMATION]: 'Basic information',
  [StringKey.GENERAL_DETAILS]: 'General Details',
  [StringKey.ESTABLISHMENT_NAME]: 'Establishment name',
  [StringKey.CONTACT_EMAIL]: 'Contact email',
  [StringKey.LOCATION]: 'Location',
  [StringKey.ADDRESS_AND_MAP]: 'Address & Map',
  [StringKey.STREET_ADDRESS]: 'Street address',
  [StringKey.LATITUDE]: 'Latitude',
  [StringKey.LONGITUDE]: 'Longitude',
  [StringKey.SCHEDULE]: 'Schedule',
  [StringKey.SECURITY]: 'Security',
  [StringKey.UPDATE_PASSWORD]: 'Update password',
  [StringKey.DANGER_ZONE]: 'Danger zone',
  [StringKey.DELETE_ESTABLISHMENT]: 'Delete establishment',
  [StringKey.DELETE_ESTABLISHMENT_WARNING]:
    'Permanently delete your establishment and all associated data. This action cannot be undone.',
  [StringKey.PREVIEW]: 'Preview',
  [StringKey.HOW_CUSTOMERS_SEE_YOU]: 'How customers see you',
  [StringKey.IMPACT]: 'Impact',
  [StringKey.YOUR_IMPACT_TOGETHER]: 'Your Impact Together',
  [StringKey.UNSAVED_CHANGES]: 'Unsaved changes',
  [StringKey.DISCARD]: 'Discard',

  // Multi-select (Product/Box dialogs)
  [StringKey.ALLERGENS]: 'Allergens',
  [StringKey.SELECT_ALLERGENS]: 'Select allergens…',
  [StringKey.SELECT_TYPES]: 'Select types…',
  [StringKey.SELECT_PRODUCTS]: 'Select products…',
  [StringKey.PRODUCTS_IN_BOX]: 'Products in box',
  [StringKey.DERIVED_ALLERGENS]: 'Allergens (from products)',
  [StringKey.NO_TYPES_AVAILABLE]: 'No types available',
  [StringKey.NO_ALLERGENS_AVAILABLE]: 'No allergens available',
  [StringKey.NO_PRODUCTS_AVAILABLE]: 'No products available',
  [StringKey.WEIGHT]: 'Weight (g)',
  [StringKey.PICTURE_URL]: 'Image URL',
  [StringKey.QUANTITY_OF_ITEMS]: 'Items in box',

  // Analytics
  [StringKey.ANALYTICS_TITLE]: 'Analytics',
  [StringKey.ANALYTICS_COMING_SOON]:
    'Analytics dashboard is coming soon. Track your sales, impact, and customer trends here.',

  // Header
  [StringKey.NOM_NOM_SAVE]: 'Nom Nom Save',
  [StringKey.LOG_IN]: 'Log In',
  [StringKey.SING_IN]: 'Sing In',
  [StringKey.DASHBOARD]: 'Dashboard',
  [StringKey.MAP]: 'Map',

  // Landing
  [StringKey.GOOD_FOOD]: 'Good Food',
  [StringKey.GREAT_PRICES]: 'Great Prices',
  [StringKey.RESCUE_FOOD_DESCRIPTION]:
    "Rescue delicious unsold food from local favorites. It's an easy way to eat well, save money, and help the planet.",
  [StringKey.NOM_NOM]: 'Nom Nom',
  [StringKey.SAVE]: 'Save',
  [StringKey.ON_THE_GO]: 'on the go',
  [StringKey.MOBILE_PROMO_DESCRIPTION]:
    'Get real-time alerts for local food drops and claim your bags in seconds.',
  [StringKey.GOOGLE_PLAY]: 'Google Play',
  [StringKey.GET_IN_ON]: 'GET IT ON',
  [StringKey.HOW_IT_WORKS]: 'How It Works',
  [StringKey.SUSTAINABLE_EATING]: 'Sustainable eating, simplified.',
  [StringKey.BROWSE_OFFERS]: 'Browse Offers',
  [StringKey.BROWSE_OFFERS_DESCRIPTION]:
    'Find local shops near you with surplus food ready to be rescued at up to 70% off.',
  [StringKey.RESERVE_BAG]: 'Reserve Bag',
  [StringKey.RESERVE_BAG_DESCRIPTION]:
    'Select a "Magic Bag" filled with delicious mystery treats and confirm your pickup.',
  [StringKey.PICK_UP_AND_SAVE]: 'Pick up & Save',
  [StringKey.PICK_UP_AND_SAVE_DESCRIPTION]:
    'Stop by at the designated time, show your receipt, and enjoy your amazing food.',
  [StringKey.AVAILABLE_NOW]: 'Available Now',
  [StringKey.FRESHLY_LISTED]: 'Freshly listed surplus near you.',
  [StringKey.NO_ESTABLISHMENTS_NEARBY]: 'No establishments nearby',
  [StringKey.EXPLORE_ALL]: 'Explore All',

  // User Profile
  [StringKey.MEMBER_SINCE]: 'Member since',
  [StringKey.ORDERS]: 'Orders',
  [StringKey.SAVED]: 'Saved',
  [StringKey.PROFILE_SETTINGS]: 'Profile Settings',
  [StringKey.PROFILE_SETTINGS_DESCRIPTION]:
    'Manage your personal information, address, and account preferences to keep your Nom Nom Sav experience running smoothly.',
  [StringKey.PERSONAL_DETAILS]: 'Personal Details',
  [StringKey.NOTIFY_NEARBY]: 'Notify me about nearby establishments',
  [StringKey.NOTIFY_CLOSING_SOON]: 'Notify me when establishments are closing soon',
  [StringKey.NOTIFY_NEW_ITEMS]: 'Notify me about new items',
  [StringKey.MY_ORDERS]: 'My Orders',
  [StringKey.FAVORITES]: 'Favorites',
  [StringKey.PAYMENT_METHODS]: 'Payment Methods',
  [StringKey.PROFILE]: 'Profile',

  // User Orders
  [StringKey.TOTAL_ORDERS]: 'Total Orders',
  [StringKey.MONEY_SAVED]: 'Money Saved',
  [StringKey.WASTE_PREVENTED]: 'Waste Prevented',
  [StringKey.UPCOMING_ORDERS]: 'Upcoming Orders',
  [StringKey.COMPLETED_ORDERS]: 'Completed Orders',
  [StringKey.NO_UPCOMING_ORDERS]: 'No Upcoming Orders',
  [StringKey.PICKUP]: 'Pickup',
  [StringKey.SHOW_QR]: 'Show QR',
  [StringKey.EXPIRED]: 'Expired',
  [StringKey.ORDER_CANCELED]: 'Order cancelled successfully!',
  [StringKey.FAILED_TO_CANCEL_ORDER]: 'Failed to cancel order',
  [StringKey.PRICE]: 'Price',
  [StringKey.CANCEL_ORDER]: 'Cancel Order',
  [StringKey.SURE_TO_CANCEL_ORDER]: 'Are you sure you want to cancel this order?',
  [StringKey.COMPLETED]: 'Completed',
  [StringKey.PICKED_UP]: 'Picked up',
  [StringKey.NO_COMPLETED_ORDERS]: 'No Completed Orders',
  [StringKey.CANCELLED_OR_EXPIRED_ORDERS]: 'Cancelled or Expired Orders',
  [StringKey.CANCELLED]: 'Cancelled',
  [StringKey.NO_CANCELLED_OR_EXPIRED_ORDERS]: 'No Cancelled or Expired Orders',
  [StringKey.QR_CODE]: 'QR Code',

  // Favorites
  [StringKey.YOUR_SAVED_ESTABLISHMENTS]: 'Your saved establishments',
  [StringKey.PLACES]: 'places',
  [StringKey.ADDED]: 'Added',
  [StringKey.VIEW]: 'View',
  [StringKey.NO_FAVORITES_ESTABLISHMENTS]: 'No favorite establishments',
  [StringKey.SUCCESSFULLY_REMOVED_FROM_FAVORITES]:
    'Successfully removed {establishmentName} from favorites',
  [StringKey.FAILED_TO_REMOVE_FROM_FAVORITES]:
    'Failed to remove {establishmentName} from favorites',
  [StringKey.REMOVE_FROM_FAVORITES]: 'Remove from favorites',
  [StringKey.SURE_YOU_WANT_TO_REMOVE_FROM_FAVORITES]:
    'Are you sure you want to remove {establishmentName} from favorites?',
  [StringKey.REMOVE]: 'Remove',
  [StringKey.REMOVING]: 'Removing',
  [StringKey.SUCCESSFULLY_ADDED_TO_FAVORITES]:
    'Successfully added {establishmentName} to favorites',
  [StringKey.FAILED_TO_ADD_TO_FAVORITES]: 'Failed to add {establishmentName} to favorites',
};
