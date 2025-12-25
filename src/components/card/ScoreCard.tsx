// import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
// import {cn} from '@/lib/utils';
//
// interface ScoreCardProps {
//     name: string;
//     totalMark: number;
//     corrected?: number;
//     incorrect?: number;
//     unanswered?: number;
//     className?: string;
//     onClickAction?: () => void;
//
//     actionText?: string;
//
//
// }
//
// export default function ScoreCard({
//                                       name,
//                                       corrected,
//                                   }: ScoreCardProps) {
//     const initials = name
//         .split(' ')
//         .map(part => part[0])
//         .join('')
//         .toUpperCase()
//         .slice(0, 2);
//
//     return (
//         <div
//             className={cn(
//                 'w-full max-w-xs bg-white border border-gray-200 rounded-lg shadow p-4 hover:bg-gradient-to-l from-green-50 to-green-100 transition duration-300 ease-in-out',
//                 'flex flex-col items-start justify-start gap-4',
//                 'hover:shadow-lg hover:scale-105',
//                 'cursor-pointer'
//             )}
//         >
//             <div className="flex items-center">
//                 <Avatar className="h-12 w-12">
//                     <AvatarImage src="https://via.placeholder.com/50" alt={name}/>
//                     <AvatarFallback>{initials}</AvatarFallback>
//                 </Avatar>
//                 <div className="ml-4">
//                     <h2 className="text-lg font-semibold">{name}</h2>
//                     <p className="text-sm text-gray-500">
//                         Corrected:
//                         <span className="text-green-600 ml-2 font-bold">{corrected}</span>
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// }
//
// export default ScoreCard