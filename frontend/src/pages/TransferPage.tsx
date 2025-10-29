import React from 'react';
import { useAuth } from '../hooks/useAuth';
import TransferForm from '../components/TransferForm';

const TransferPage: React.FC = () => {
    const { user } = useAuth();
    const account = user?.account;

    if (!account) return <div className="text-center p-8">Loading account details...</div>;

    return (
        <div className="flex justify-center items-start w-full pt-[40px] pb-10">
            <div className="bg-white p-[30px] max-w-[600px] w-full rounded-xl shadow-2xl border border-gray-200">
                <h1 className="text-center mb-4 text-3xl font-bold text-gray-800">
                    Transfer Dana
                </h1>
                <p className="text-center mb-6 text-lg text-gray-600 font-medium">
                    Saldo sumber saat ini:
                    <span className="text-indigo-600 font-bold ml-1">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(account.balance)}
                    </span>
                </p>

                <div className="mt-6 border-t border-gray-200 pt-6">
                    <TransferForm fromAccountId={account.id} />
                </div>
            </div>
        </div>
    );
};

export default TransferPage;
