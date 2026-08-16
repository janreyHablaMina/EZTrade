import { useState } from 'react';
import { apiClient } from '../lib/api';

export function useTradeCode(user: any) {
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [redeemed, setRedeemed] = useState(false);
  const [reward, setReward] = useState(0);
  const [newBalance, setNewBalance] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async () => {
    if (!code.trim()) {
      setErrorMsg('Please enter a trading code.');
      return;
    }
    setErrorMsg('');
    setSubmitting(true);
    try {
      const endpoint = user?.id
        ? `/trading-codes/redeem?user_id=${user.id}`
        : '/trading-codes/redeem';

      const res = await apiClient.post(endpoint, { code: code.trim() });
      setReward(res.reward ?? 0);
      setNewBalance(res.new_balance ?? 0);
      setRedeemed(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setCode('');
    setRedeemed(false);
    setReward(0);
    setErrorMsg('');
  };

  return {
    code,
    setCode: (val: string) => {
      setCode(val.toUpperCase());
      setErrorMsg('');
    },
    submitting,
    redeemed,
    reward,
    newBalance,
    errorMsg,
    handleSubmit,
    handleReset,
  };
}
