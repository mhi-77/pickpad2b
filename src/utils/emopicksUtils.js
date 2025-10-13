import { supabase } from '../lib/supabase';

export const loadEmopicksWithCount = async () => {
  try {
    const { data, error } = await supabase
      .from('emopicks')
      .select('id, display, count')
      .gt('count', 0)
      .order('id');

    if (error) {
      console.error('Error loading emopicks:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in loadEmopicksWithCount:', error);
    return [];
  }
};

export const formatEmopickDisplay = (display, count) => {
  return `${display} (${count})`;
};
