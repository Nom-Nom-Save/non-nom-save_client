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

  // Header
  [StringKey.NOM_NOM_SAVE]: 'Nom Nom Save',
  [StringKey.LOG_IN]: 'Log In',
  [StringKey.SING_IN]: 'Sing In',

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
};
