import React from 'react';
import { Shield, Scale, Lock, Users, Award, Coins, Vote } from 'lucide-react';
import Image from 'next/image';

export default function FaqPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
        <p className="text-gray-600">Understanding how SaveCircle protects and rewards its members</p>
      </div>

      <div className="space-y-16">
        {/* About SaveCircle Section */}
        <section className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className='p-2 bg-blue-50 rounded-lg'><Image src="/favicon.svg" alt="save circle logo" width={30} height={30}/></div>
              <h2 className="text-2xl font-semibold text-gray-900">About SaveCircle</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">What is SaveCircle?</h3>
              <p className="text-gray-600">
                SaveCircle is a community-driven integration where needs and demands meet smart contributive savings, 
                cancelling out the daily interest rates and charges posed by traditional banking systems while maintaining 
                control, flexibility, and a feasible planning system over your funds.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">How is SaveCircle better than traditional banks?</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li><span className="font-semibold text-blue-600">Blockchain integration:</span> All transactions are recorded on-chain</li>
                <li><span className="font-semibold text-blue-600">High security:</span> Protected by smart contracts</li>
                <li><span className="font-semibold text-blue-600">No charges:</span> Zero interest rates and banking fees</li>
                <li><span className="font-semibold text-blue-600">Flexible planning:</span> Feasible and customizable savings system</li>
                <li><span className="font-semibold text-blue-600">Global access:</span> Accessible by anyone, from anywhere in the world</li>
              </ul>
            </div>
          </div>
        </section>

        {/* DAO Section */}
        <section className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-50 rounded-lg">
              <Vote className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">Decentralized Autonomous Organization (DAO)</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">What is the DAO?</h3>
              <p className="text-gray-600">
                DAO stands for Decentralized Autonomous Organization which runs on blockchain technology (Ethereum blockchain under Starknet), 
                where decision-making and governance are carried out collectively by its members rather than a central authority, 
                giving free reign to decisions and votes placed by everyone in the system.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">What's the use of DAO in SaveCircle?</h3>
              <p className="text-gray-600">
                SaveCircle operates as an investment DAO where members contribute their funds collectively to start savings accounts 
                and accumulate assets, instead of using traditional venture capital firms with a small team of decision-makers.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">How does DAO apply in SaveCircle?</h3>
              <ol className="list-decimal pl-5 space-y-2 text-gray-600">
                <li><span className="font-semibold text-green-600">Governance:</span> Members vote on how contribution groups and funds are allocated (startup amounts, locked amounts, DeFi investments, NFT acquisitions, or supporting early-stage startups)</li>
                <li><span className="font-semibold text-green-600">Execution:</span> Investments are carried out via smart contracts, ensuring transparency, security, and automation</li>
                <li><span className="font-semibold text-green-600">Returns:</span> Profits are distributed back to members, often proportionally to their contribution or individual groups</li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">How are group votings and quests carried out?</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>On-chain voting through Governor contracts</li>
                <li>Off-chain proposals with Snapshot, then executed on-chain by multi-sig</li>
                <li>Quests on Zealy, Galxe, and TaskOn to earn NFTs and other badges</li>
              </ul>
            </div>
          </div>
        </section>

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
                <span className="font-semibold text-purple-600"> commitment guarantee</span> and serve as a 
                <span className="font-semibold text-purple-600"> penalty pool</span> if defaults are encountered during the circle. 
                Note: All funds are returned if no issues are encountered during payment.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">How do Locked Funds work?</h3>
              <ol className="list-decimal pl-5 space-y-2 text-gray-600">
                <li>When you join a group, you deposit the required amount (e.g., 10% of the total cycle amount upfront)</li>
                <li>This deposit is held as collateral in the locked balance under your wallet address</li>
                <li>These locked funds are used to determine payout position and serve as a commitment guarantee and penalty fee if default is found during payment</li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Why are funds locked instead of paid weekly by hand?</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li><span className="font-semibold">Guarantee:</span> By locking upfront, members prove commitment, reducing risk of defaults</li>
                <li><span className="font-semibold">Automation:</span> Penalties are deducted automatically from here</li>
                <li><span className="font-semibold">Fairness:</span> Everyone has "skin in the game," making the group more reliable</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Can I withdraw my locked funds early?</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Locked funds <span className="font-semibold">cannot be withdrawn</span> until the savings circle is completed</li>
                <li>Early withdrawal or quitting may result in <span className="font-semibold text-amber-600">penalties</span>, which go into the Penalty Pool</li>
                <li>Once the circle ends and all obligations are met, you can reclaim your remaining locked balance</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">How do locked funds connect to reputation?</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>If you complete all contributions, your locked balance is released and your <span className="font-semibold text-green-600">reputation score increases</span></li>
                <li>If you default or quit, part of your locked funds is slashed as a <span className="font-semibold text-amber-600">penalty</span>, lowering your reputation</li>
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
                The insurance pool is a safety mechanism implemented to protect members and their funds from defaulting members 
                during a contribution circle. Each participant contributes <span className="font-semibold text-indigo-600">1% of their contribution</span> 
                into this pool at the start of each savings cycle.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">How does the Insurance Pool work?</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>If a member defaults during payments or drops out, the insurance pool automatically covers part of the shortfall so the payout can still be fairly distributed</li>
                <li>If nobody defaults during the entire cycle, the pool is considered "unused." A small percentage based on the total pool amount is taken as a maintenance fee for the protocol, and the remaining 80% is distributed back to the members in that pool</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Why is the Insurance Pool important?</h3>
              <p className="text-gray-600">
                It reduces the risk of loss while increasing commitment and credibility of members, ensuring the contribution circle 
                can continue moving even if one or more participants fail to meet their obligations. Essentially, it builds trust by 
                offering a financial cushion against unprecedented falls.
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
                The penalty pool is a system where users who miss out on contributions, pay late, or withdraw early are penalized. 
                These penalties are deducted from their locked balance and pooled together.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">How does the Penalty Pool work?</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>If you default (miss your turn to contribute), a portion of your locked funds is taken as a penalty</li>
                <li>These penalties accumulate into the penalty pool and can be redistributed among compliant members or reserved by the system</li>
                <li>This discourages careless behavior and ensures fairness for those who stick to the rules</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">How is the Penalty Pool different from the Insurance Pool?</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li><span className="font-semibold text-indigo-600">Insurance Pool:</span> Proactive safety net funded by everyone (1% contribution) to protect against defaults</li>
                <li><span className="font-semibold text-amber-600">Penalty Pool:</span> Reactive punishment funded by defaulters and late contributors as a consequence of their actions</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Why is the Penalty Pool important?</h3>
              <p className="text-gray-600">
                It encourages discipline and accountability within the circle. By knowing that late or missed payments come with 
                financial consequences, members are more likely to stay committed.
              </p>
            </div>
          </div>
        </section>

        {/* Reputation Section */}
        <section className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Award className="w-6 h-6 text-orange-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">Reputation System</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">What is Reputation in SaveCircle?</h3>
              <p className="text-gray-600">
                Reputation is a systematic way to accredit ranking and commitment of users to pools they were once part of or are currently part of. 
                The reputation works on the Proof of Work (PoW) mechanism using growth level and repayment of contributions during a circle.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">How does Reputation work?</h3>
              <p className="text-gray-600 mb-3">
                The reputation system runs as a progressive change based on in-app activities. Your reputation is calculated from:
              </p>
              <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded">
                Activeness + Locked Amount + Account Type + Repayment/Contribution Time + Circle Participation + DAO Voting + Post Commitment + Task and Quest Completion = Reputation
              </p>
              <p className="text-gray-600">
                Simply put, in-app activities and account health are strong ways to build reputation.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">What are the benefits of Reputation?</h3>
              <p className="text-gray-600">
                Building reputation in SaveCircle grows your level of trust, credibility, and feasibility, making it easier to access 
                other strong services. The SaveCircle reputation system rewards highest and consistent streaks with an in-app NFT on 
                the Starknet network, making it possible to lend, borrow, and repay funds using those NFTs.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">What is Reputation NFT?</h3>
              <p className="text-gray-600">
                This is a Proof of Stake (PoS) NFT that runs on the Starknet network, used as an in-app tool in SaveCircle. 
                It's powered by reputation and streaks earned from app activities: lending, borrowing, contribution, repayment, and streaks. 
                It serves as a valuable asset and collateral for requested funds.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Uses of Reputation NFT in and out of SaveCircle</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Serves as collateral for underlying assets being collected</li>
                <li>Can be sold in the future as prices become stronger</li>
                <li>Can be used to pay off pending debts</li>
                <li>Over time, SaveCircle reputation NFTs will be used in other places</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Conclusion */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 text-center border border-blue-100">
          <p className="text-lg text-gray-700">
            🚀 <span className="font-semibold text-blue-800">SaveCircle combines traditional savings circles with modern blockchain technology</span>, 
            creating a secure, transparent, and community-driven financial ecosystem where <span className="font-semibold text-purple-800">everyone benefits from collective growth and accountability</span>.
          </p>
        </div>
      </div>
    </div>
  );
}