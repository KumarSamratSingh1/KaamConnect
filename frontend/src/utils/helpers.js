export const SKILLS = [
  { id: 'cooking', label: 'Cooking', icon: '🍳' },
  { id: 'cleaning', label: 'Cleaning', icon: '🧹' },
  { id: 'babysitting', label: 'Babysitting', icon: '👶' },
  { id: 'eldercare', label: 'Elder Care', icon: '👴' },
  { id: 'washing', label: 'Washing', icon: '👕' },
  { id: 'ironing', label: 'Ironing', icon: '👔' },
  { id: 'gardening', label: 'Gardening', icon: '🌿' },
  { id: 'driving', label: 'Driving', icon: '🚗' },
  { id: 'petcare', label: 'Pet Care', icon: '🐾' },
  { id: 'nursing', label: 'Nursing', icon: '💊' },
];

export const LANGUAGES = ['Hindi', 'English', 'Bengali', 'Telugu', 'Marathi', 'Tamil', 'Gujarati', 'Kannada', 'Odia', 'Punjabi', 'Malayalam'];

export const WORK_TYPES = [
  { id: 'full-time', label: 'Full Time' },
  { id: 'part-time', label: 'Part Time' },
  { id: 'hourly', label: 'Hourly' },
  { id: 'live-in', label: 'Live-in' },
];

export const BOOKING_STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'badge-orange', icon: '⏳' },
  accepted: { label: 'Accepted', color: 'badge-blue', icon: '✅' },
  confirmed: { label: 'Confirmed', color: 'badge-blue', icon: '✅' },
  in_progress: { label: 'In Progress', color: 'badge-purple', icon: '🔄' },
  completed: { label: 'Completed', color: 'badge-green', icon: '🎉' },
  cancelled: { label: 'Cancelled', color: 'badge-red', icon: '❌' },
  rejected: { label: 'Rejected', color: 'badge-red', icon: '❌' },
  disputed: { label: 'Disputed', color: 'badge-red', icon: '⚠️' },
};

export const formatCurrency = (amount, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export const formatTime = (time) => {
  if (!time) return '';
  const [h, m] = time.split(':');
  const hour = parseInt(h);
  return `${hour > 12 ? hour - 12 : hour}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
};

export const timeAgo = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
};

export const getInitials = (name = '') =>
  name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

export const getRatingStars = (rating) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return { full, half, empty: 5 - full - (half ? 1 : 0) };
};

export const truncate = (str, len = 100) =>
  str && str.length > len ? str.slice(0, len) + '...' : str;

export const INDIAN_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai',
  'Kolkata', 'Surat', 'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur',
  'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara', 'Ghaziabad'
];
