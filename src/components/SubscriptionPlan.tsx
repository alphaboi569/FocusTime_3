import React from 'react';
import { Check, Zap, Crown, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const SubscriptionPlan = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const plans = [
    {
      name: 'Free',
      icon: Star,
      price: '0',
      features: [
        'Basic site blocking',
        'Simple focus timer',
        'Daily statistics',
        '3 timer presets'
      ],
      current: user?.subscription === 'free'
    },
    {
      name: 'Pro',
      icon: Crown,
      price: '4.99',
      features: [
        'Advanced site blocking',
        'Custom focus timer',
        'Detailed analytics',
        'Unlimited presets',
        'Priority support',
        'Cross-device sync',
        'Custom themes',
        'No ads'
      ],
      current: user?.subscription === 'pro',
      popular: true
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">{t('subscription')}</h1>
        <p className="text-gray-600">{t('choosePlan')}</p>
      </header>

      <div className="space-y-4">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <div
              key={plan.name}
              className={`relative rounded-xl border ${
                plan.current
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 bg-white'
              } p-6 shadow-sm hover:shadow-md transition-all`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-6 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                  <Zap size={12} />
                  Most Popular
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Icon
                      size={24}
                      className={plan.current ? 'text-indigo-600' : 'text-gray-400'}
                    />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {plan.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500">
                    {plan.current ? 'Current plan' : `$${plan.price}/month`}
                  </p>
                </div>
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    plan.current
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {plan.current ? 'Current' : 'Upgrade'}
                </button>
              </div>

              <div className="space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <div className={`p-0.5 rounded-full ${
                      plan.current ? 'bg-indigo-600' : 'bg-gray-400'
                    }`}>
                      <Check size={12} className="text-white" />
                    </div>
                    <span className="text-sm text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>

              {plan.current && (
                <div className="mt-4 pt-4 border-t border-indigo-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Next billing date</span>
                    <span className="font-medium text-gray-900">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <Crown size={24} />
          <h3 className="text-lg font-semibold">Special Offer</h3>
        </div>
        <p className="text-indigo-100 mb-4">
          Get 3 months of Pro for the price of 2 when you upgrade today!
        </p>
        <button className="w-full bg-white text-indigo-600 py-2 rounded-lg font-medium hover:bg-indigo-50 transition-colors">
          Claim Offer
        </button>
      </div>
    </div>
  );
};

export default SubscriptionPlan;