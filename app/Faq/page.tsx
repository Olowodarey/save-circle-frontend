import React from 'react';
import { Shield, Scale, Lock } from 'lucide-react';

export default function FaqPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
        <p className="text-gray-600">Understanding how SaveCircle protects and rewards its members</p>
      </div>

      <div className="space-y-16">
        {/* Locked Funds Section */}
        <section className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Lock className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">Locked Funds</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">What are Locked Funds in SaveCircle?</h3>
              <p className="text-gray-600">
                Locked funds are the amount each participant deposits when joining a savings circle. These funds act as both a 
                <span className="font-semibold text-purple-600"> commitment guarantee </span> and serve as 
                <span className="font-semibold text-purple-600"> penalty  pool</span>.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">How do Locked Funds work?</h3>
              <ol className="list-decimal pl-5 space-y-2 text-gray-600">
                <li>When you join a group, you deposit the required amount (e.g., 10% of the total cycle amount upfront).</li>
                <li> this deposit is held in the <span className="font-semibold">locked balance</span> under your wallet address.</li>
               <li>
                this lock funds are used to determine payout position and also serve as a commitment guarantee and penalty pool
               </li>
             
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Why are funds locked instead of paid weekly by hand?</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li><span className="font-semibold">Guarantee:</span> By locking upfront, members prove commitment, reducing risk of defaults.</li>
                <li><span className="font-semibold">Automation:</span> penalties are deducted automatically, from here .</li>
                <li><span className="font-semibold">Fairness:</span> Everyone has "skin in the game," making the group more reliable.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Can I withdraw my locked funds early?</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Normally, <span className="font-semibold">no</span>. Locked funds stay until the savings circle is completed.</li>
                <li>If you try to withdraw or quit early, you may face <span className="font-semibold text-amber-600">penalties</span>, which go into the Penalty Pool.</li>
                <li>Once the circle ends and all obligations are met, you can reclaim your remaining locked balance.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">How do locked funds connect to reputation?</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>If you always complete your contributions, your locked balance is released normally and your <span className="font-semibold text-green-600">reputation score increases</span>.</li>
                <li>If you default or quit, part of your locked funds is slashed as a <span className="font-semibold text-amber-600">penalty</span>, lowering your reputation.</li>
              </ul>
            </div>
          </div>

         
        </section>

        {/* Insurance Pool Section */}
        <section className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Shield className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">Insurance Pool</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">What is the Insurance Pool in SaveCircle?</h3>
              <p className="text-gray-600">
                The insurance pool is a safety mechanism designed to protect members if someone defaults on their contributions. 
                Each participant contributes <span className="font-semibold text-indigo-600">1% of their contribution</span> into this pool at the start of each  savings cycle.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">How does the Insurance Pool work?</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>When a member misses payments or drops out, the insurance pool automatically covers part of the shortfall so the payout can still be fairly distributed.</li>
                <li>
                  If nobody defaults during the entire cycle, the pool is considered "unused." In this case, 
                  <span className="font-semibold text-indigo-600"> 20% of the pool is taken as a maintenance fee</span> for sustaining the protocol, 
                  and the remaining 80% will be  reallocated and distributed back to the members.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Why is the Insurance Pool important?</h3>
              <p className="text-gray-600">
                It reduces the risk of loss for committed members and ensures the savings circle can continue smoothly even if one or more participants fail to meet their obligations. 
                Essentially, it builds trust by offering a financial cushion against unexpected defaults.
              </p>
            </div>
          </div>
        </section>

        {/* Penalty Pool Section */}
        <section className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Scale className="w-6 h-6 text-amber-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">Penalty Pool</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">What is the Penalty Pool in SaveCircle?</h3>
              <p className="text-gray-600">
                The penalty pool is a system where users who miss contributions, pay late, or withdraw early are penalized. 
                These penalties are deducted from their locked balance and pooled together.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">How does the Penalty Pool work?</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>If you default (miss your turn to contribute), a portion of your locked funds is taken as a penalty.</li>
                <li>These penalties accumulate into the penalty pool and can be redistributed among compliant members or reserved by the system.</li>
                <li>This discourages careless behavior and ensures fairness for those who stick to the rules.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">How is the Penalty Pool different from the Insurance Pool?</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li><span className="font-semibold text-amber-600">Insurance Pool</span> = proactive safety net funded by everyone (1% contribution) to protect against defaults.</li>
                <li><span className="font-semibold text-amber-600">Penalty Pool</span> = reactive punishment funded by defaulters and late contributors as a consequence of their actions.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Why is the Penalty Pool important?</h3>
              <p className="text-gray-600">
                It encourages discipline and accountability within the circle. By knowing that late or missed payments come with financial consequences, 
                members are more likely to stay committed.
              </p>
            </div>
          </div>
        </section>

        {/* Conclusion */}
        <div className="bg-blue-50 rounded-xl p-6 text-center border border-blue-100">
          <p className="text-lg text-blue-800">
            👉 Together, <span className="font-semibold">the Insurance Pool provides protection</span>, while <span className="font-semibold">the Penalty Pool enforces accountability</span>. 
            This dual system balances fairness, security, and sustainability.
          </p>
        </div>
      </div>
    </div>
  );
}