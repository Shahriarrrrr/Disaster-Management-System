

const LatestCampaigns = ({campaign}) => {
    const totalCollected = campaign.updates?.[campaign.updates.length - 1]?.total_collected;
    const goal = campaign.goal_amount || 0;
    const percentage = goal > 0 ? Math.min(100, Math.floor((totalCollected/ goal) * 100)) : 0;

    
    return (
<div>
  <h3 className="text-lg text-white font-semibold mb-2">{campaign.title}</h3>
  <p className="text-white mb-2 flex-grow">
    {campaign.description || 'No description provided.'}
  </p>

  {/* Progress bar */}
  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
    <div
      className="bg-green-500 h-3 rounded-full"
      style={{ width: `${percentage}%` }}
    ></div>
  </div>

  <div className="flex justify-between">
    <p className="text-sm text-white">raised {totalCollected} ৳</p>
    <p className="text-sm text-white">{goal.toLocaleString()} ৳ goal</p>
  </div>

  <button className="text-xl btn btn-success mt-auto w-1/5">Donate</button>
</div>

    );
};

export default LatestCampaigns;


            // <div class="w-full bg-gray-200 rounded-full h-3 mb-2">
            //   <div class="bg-green-500 h-3 rounded-full " style="width: ${percentage}%"></div>
            // </div>
            // <div class="flex gap-64">
            //   <p class="text-sm text-white-700">raised {totalCollected} ৳</p>
            //   <p class="text-sm text-white-700">${goal.toLocaleString()} ৳ goal</p>
            // </div>