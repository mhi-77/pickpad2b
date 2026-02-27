import { supabase } from '../../lib/supabase';

export const canEditPick = (votoEmitido, userType) => {
  if (userType < 3) {
    return true;
  }
  return !votoEmitido;
};

export const getBlockedMessage = (votoEmitido) => {
  if (votoEmitido) {
    return 'Este registro no puede ser modificado porque el votante ya emitió su voto.';
  }
  return '';
};

export const validatePickPermissions = (record, userType, action = 'edit') => {
  if (userType < 3) {
    return { allowed: true, message: '' };
  }

  if (action === 'edit' && record.voto_emitido) {
    return {
      allowed: false,
      message: 'No puedes editar picks de votantes que ya emitieron su voto.'
    };
  }

  if (action === 'check' && record.voto_emitido) {
    return {
      allowed: false,
      message: 'No puedes modificar la verificación de votantes que ya emitieron su voto.'
    };
  }

  return { allowed: true, message: '' };
};

export const updatePadronPick = async (documento, emopickId, pickNota, userId) => {
  const updateData = emopickId === null
    ? {
        emopick_id: null,
        emopick_user: null,
        pick_nota: null,
        pick_check: false,
        pick_check_user: null,
        pick_check_at: null
      }
    : {
        emopick_id: emopickId,
        emopick_user: userId,
        pick_nota: pickNota || null
      };

  const { data, error } = await supabase
    .from('padron')
    .update(updateData)
    .eq('documento', documento)
    .select();

  if (error) {
    throw new Error(error.message || 'Error al actualizar el pick');
  }

  return data;
};

export const updatePickCheck = async (documento, newPickCheckStatus, userId) => {
  const { data, error } = await supabase
    .from('padron')
    .update({
      pick_check: newPickCheckStatus,
      pick_check_user: newPickCheckStatus ? userId : null,
      pick_check_at: newPickCheckStatus ? new Date().toISOString() : null
    })
    .eq('documento', documento)
    .select();

  if (error) {
    throw new Error(error.message || 'Error al actualizar la verificación');
  }

  return data;
};
