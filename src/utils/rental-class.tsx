export const getStatusClass = (status: string) => {
  switch (status.toLowerCase()) {
    case 'paid':
    case 'completed':
      return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs';
    case 'cancelled':
      return 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs';
    default:
      return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
  }
};
