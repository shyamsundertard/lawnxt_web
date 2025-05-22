"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/useStore';
import Input from '@/app/ui/forms/Input';
import Image from 'next/image';
import axiosInstance from '@/app/lib/axiosInstance';
import { Firm } from '@/app/types';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';
import LogoutButton from '@/app/ui/LogoutButton';

export default function CreateFirm() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const router = useRouter();
  const { user } = useUserStore();
  // const { plans } = useSubscriptionStore();

  const validateData = () => {
    const newErrors: { [key: string]: string } = {};

    if (step === 1) {
      if (!name) newErrors.name = "Name of Firm is required.";
      if (!phone) newErrors.phone = "Contact number is required.";
    } else if (step === 2) {
      if (!selectedPlan) newErrors.plan = "Please select a plan";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateData()) {
      setStep(2);
    }
  };

  const handlePlanSelect = (planName: string) => {
    setSelectedPlan(planName);
  };

  const handleBillingCycleChange = (cycle: 'monthly' | 'yearly') => {
    setBillingCycle(cycle);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateData()) return;

    try {
      setLoading(true);

      if (!user?.$id) throw new Error("User not authenticated");

      // const selectedPlanData = plans.find(plan => plan.name === selectedPlan);
      // if (!selectedPlanData) throw new Error("Invalid plan selected");

      // Determine subscription details
      let subscriptionDays = "0";
      let subscriptionType = '';
      const price = '0';

      if (selectedPlan === 'Trial') {
        subscriptionDays = "7";
        subscriptionType = 'trial';
      }
      // } else {
      //   subscriptionDays = billingCycle === 'monthly' ? "30" : "365";
      //   subscriptionType = billingCycle;
      //   price = billingCycle === 'monthly' 
      //     ? selectedPlanData.monthlyPrice 
      //     : selectedPlanData.yearlyPrice;
      // }

      // Create firm with subscription details
      const response = await axiosInstance.post('/api/firm/createFirm', {
        name,
        userId: user.$id,
        subscriptionPlan: selectedPlan,
        subscriptionType,
        subscriptionDays,
        subscriptionPrice: price,
        // caseLimit: selectedPlan === 'Platinum' ? 'Unlimited' : selectedPlanData.caseLimit,
        // memberLimit: selectedPlan === 'Platinum' ? 'Unlimited' : selectedPlanData.memberLimit
      });

      const firm = response.data as unknown as Firm;

      const role = 'Owner';
      const status = 'Approved';

      await axiosInstance.post('/api/addFirmMember', {
        firmId: firm.$id, 
        userId: user.$id, 
        name: user.name, 
        email: user.email, 
        phone, 
        role, 
        status
      });

      router.push('/');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create firm", {
        icon: <X/>
      });
    } finally {
      setLoading(false);
    }
  };

  const getButtonText = () => {
    if (loading) return "Processing...";
    if (selectedPlan === 'Trial') return "Start Trial";
    return "Create Firm";
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-gray-800 relative bg-gray-50 p-4">
      {step === 1 && (
        <div className="absolute inset-0 md:hidden">
          <Image src='/lawnxt.svg' alt="Background" layout="fill" objectFit="cover" priority className="-z-20" />
        </div>
      )}

      <div className={`flex flex-col bg-white text-gray-800 rounded-lg border-2 overflow-hidden ${step === 1 ? 'md:flex-row md:w-3/4 lg:w-2/3 xl:w-1/2' : 'max-w-6xl w-full'} shadow-lg relative z-10`}>
        {step === 1 && (
          <div className="hidden md:flex flex-1">
            <Image src='/lawnxt.svg' alt="Background" className="h-full w-full object-cover" width={1000} height={1000} priority />
          </div>
        )}

        <div className="flex-1 p-5 md:p-10 flex flex-col justify-center">
          <h1 className="text-2xl md:text-3xl font-semibold text-center">
            {step === 1 ? "Create Your Law Firm" : "Choose Your Subscription Plan"}
          </h1>
          
          {/* Progress Dots */}
          <div className="flex justify-center space-x-10 my-6">
            <div className={`h-2 w-2 rounded-full ${step >= 1 ? 'bg-gray-900' : 'bg-gray-300'}`}></div>
            <div className={`h-2 w-2 rounded-full ${step >= 2 ? 'bg-gray-900' : 'bg-gray-300'}`}></div>
          </div>

          {step === 1 ? (
            <form onSubmit={handleNextStep} className="space-y-6 mt-6 mb-2">
              <Input 
                label="Firm Name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                isInvalid={!!errors.name}
                errorMessage={errors.name}
                variant="outlined"
              />

              <Input 
                label="Your Contact Number" 
                type='tel'
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                isInvalid={!!errors.phone}
                errorMessage={errors.phone}
              />

              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-900"
              >
                Next
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Plan Cards Container - Following the SVG design */}
              <div className="flex flex-col lg:flex-row justify-center gap-5 py-4 max-h-[70vh] overflow-y-auto">
                {/* Trial Plan Card */}
                <div
                  onClick={() => handlePlanSelect('Trial')}
                  className={`border-2 rounded-lg p-6 cursor-pointer transition-all w-full lg:w-1/3 h-fit ${
                    selectedPlan === 'Trial' 
                      ? 'border-black bg-gray-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold">Trial</h3>
                      <p className="text-xs text-gray-500">Plan</p>
                    </div>
                    <p className="text-xl font-bold">FREE</p>
                  </div>
                  
                  <p className="mt-2 text-sm text-gray-600">Trial Plan</p>
                  
                  <div className="mt-6 space-y-3 text-sm">
                    <p>✓ 7-day free trial</p>
                    <p>✓ 5 case limit</p>
                    <p>✓ 3 member limit</p>
                    <p className="text-xs text-gray-500 mt-4">No credit card required</p>
                  </div>
                </div>

                {/* Standard Plan Card */}
                <div
                  onClick={() => handlePlanSelect('Standard')}
                  className={`border-2 rounded-lg p-6 cursor-pointer transition-all w-full lg:w-1/3 h-fit ${
                    selectedPlan === 'Standard' 
                      ? 'border-black bg-gray-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  } ${selectedPlan === 'Standard' ? 'lg:h-auto' : 'lg:h-auto'}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold">Standard</h3>
                      <p className="text-xs text-gray-500">Plan</p>
                    </div>
                    <p className="text-xl font-bold">
                      ₹{billingCycle === 'monthly' ? '499' : '4999'}
                    </p>
                  </div>
                  
                  <p className="mt-2 text-sm text-gray-600">Standard Plan</p>
                  
                  <div className="mt-6 space-y-3 text-sm">
                    <p>✓ 25 cases</p>
                    <p>✓ 5 members</p>
                    <p>✓ Standard features</p>
                  </div>
                  
                  {/* Billing Cycle Buttons - Only for selected plan */}
                  {selectedPlan === 'Standard' && (
                    <>
                      <div className="flex justify-center space-x-2 mt-8">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBillingCycleChange('monthly');
                          }}
                          className={`px-4 py-1 text-sm rounded ${
                            billingCycle === 'monthly' 
                              ? 'bg-black text-white' 
                              : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          Monthly
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBillingCycleChange('yearly');
                          }}
                          className={`px-4 py-1 text-sm rounded ${
                            billingCycle === 'yearly' 
                              ? 'bg-black text-white' 
                              : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          Yearly
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Billed {billingCycle}
                      </p>
                    </>
                  )}
                </div>

                {/* Platinum Plan Card */}
                <div
                  onClick={() => handlePlanSelect('Platinum')}
                  className={`border-2 rounded-lg p-6 cursor-pointer transition-all w-full lg:w-1/3 h-fit ${
                    selectedPlan === 'Platinum' 
                      ? 'border-black bg-gray-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold">Platinum</h3>
                      <p className="text-xs text-gray-500">Plan</p>
                    </div>
                    <p className="text-xl font-bold">
                      ₹{billingCycle === 'monthly' ? '999' : '9999'}
                    </p>
                  </div>
                  
                  <p className="mt-2 text-sm text-gray-600">Platinum Plan</p>
                  
                  <div className="mt-6 space-y-3 text-sm">
                    <p>✓ Unlimited cases</p>
                    <p>✓ Unlimited members</p>
                    <p>✓ Platinum features</p>
                  </div>
                  
                  {/* Billing Cycle Buttons - Only for selected plan */}
                  {selectedPlan === 'Platinum' && (
                    <>
                      <div className="flex justify-center space-x-2 mt-8">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBillingCycleChange('monthly');
                          }}
                          className={`px-4 py-1 text-sm rounded ${
                            billingCycle === 'monthly' 
                              ? 'bg-black text-white' 
                              : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          Monthly
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBillingCycleChange('yearly');
                          }}
                          className={`px-4 py-1 text-sm rounded ${
                            billingCycle === 'yearly' 
                              ? 'bg-black text-white' 
                              : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          Yearly
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Billed {billingCycle}
                      </p>
                    </>
                  )}
                </div>
              </div>

              {errors.plan && <p className="text-red-500 text-sm text-center">{errors.plan}</p>}

              <div className="flex space-x-4 px-2 pb-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 border border-black py-2.5 rounded-lg hover:bg-gray-100 font-medium"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading || !selectedPlan}
                  className={`flex-1 py-2.5 rounded-lg font-medium ${
                    loading || !selectedPlan
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-black text-white hover:bg-gray-900'
                  }`}
                >
                  {getButtonText()}
                </button>
              </div>
            </form>
          )}
          <LogoutButton/>
        </div>
      </div>
    </div>
  );
}