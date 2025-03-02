const UserAchievements = () => {
  return (
    <div className="space-y-6">
      <h2 className="font-hse-sans text-xl font-semibold">
        Разблокировано {achievements.filter(a => a.unlocked).length} из {achievements.length}
      </h2>
      
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`flex flex-col items-center justify-center rounded-lg p-4 text-center ${
              achievement.unlocked ? "" : "opacity-40"
            }`}
          >
            <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
              {achievement.imageUrl ? (
                <div className="relative h-16 w-16 overflow-hidden rounded-full">
                  <div
                    className="h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${achievement.imageUrl})` }}
                  ></div>
                </div>
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-200 text-blue-700">
                  <span className="font-hse-sans text-xl font-bold">
                    {achievement.name.substring(0, 1)}
                  </span>
                </div>
              )}
            </div>
            <h3 className="font-hse-sans text-sm font-medium">
              {achievement.name}
            </h3>
            <p className="font-hse-sans mt-1 text-xs text-gray-500">
              {achievement.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserAchievements