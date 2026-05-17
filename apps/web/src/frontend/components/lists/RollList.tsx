import RollCard from "@/frontend/components/cards/RollCard";
import type { Roll } from "@/frontend/types/roll";
import CreateNewRollCard from "../cards/CreateNewRollCard";

interface RollListProps {
	isOwner: boolean;
	rolls: Roll[];
}

export default function RollList({ rolls, isOwner }: RollListProps) {
	return (
		<div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-5">
			{isOwner && <CreateNewRollCard key="create-new-roll" />}
			{rolls?.length > 0 &&
				rolls.map((roll) => {
					const imageUrls =
						roll.previewPhotos ??
						(roll.imageUrl || roll.imageUrl
							? [roll.imageUrl ?? roll.imageUrl ?? ""]
							: []);
					return (
						<RollCard
							createdAt={roll.createdAt}
							id={roll.rollId}
							imageUrls={imageUrls}
							key={roll.rollId}
							name={roll.name}
							userId={roll.userId}
						/>
					);
				})}
		</div>
	);
}
