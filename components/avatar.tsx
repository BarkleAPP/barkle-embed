import Image from 'next/image'
import { User } from 'misskey-js/built/entities'

// Extend User type to include properties that might be missing in UserLite or specific to the instance
interface ExtendedUser extends User {
    isCat?: boolean;
    isLive?: boolean;
    isBot?: boolean;
    avatarDecorations?: {
        id: string;
        url: string;
        angle?: number;
        flipH?: boolean;
        offsetX?: number;
        offsetY?: number;
    }[];
    avatarBlurhash?: string;
}

interface AvatarProps {
    user: ExtendedUser;
    size?: number;
    disableLink?: boolean;
    disablePreview?: boolean;
    showIndicator?: boolean;
    decorations?: ExtendedUser['avatarDecorations'];
    disableDecorations?: boolean;
    className?: string;
}

export default function Avatar({ 
    user, 
    size = 48, 
    disableLink = false, 
    disablePreview = false, 
    showIndicator = false, 
    decorations, 
    disableDecorations = false,
    className = ''
}: AvatarProps) {
    
    const avatarUrl = user.avatarUrl || '/static-assets/user-unknown.png';
    const decorationsToShow = disableDecorations ? [] : (decorations || user.avatarDecorations || []);

    const getDecorationStyle = (decoration: any) => {
        const angle = decoration.angle ? `${decoration.angle * 360}deg` : '0deg';
        const scaleX = decoration.flipH ? -1 : 1;
        const offsetX = decoration.offsetX ? `${decoration.offsetX * 100}%` : '0';
        const offsetY = decoration.offsetY ? `${decoration.offsetY * 100}%` : '0';
        
        return {
            transform: `translate(${offsetX}, ${offsetY}) rotate(${angle}) scaleX(${scaleX})`,
        };
    };

    return (
        <div 
            className={`relative inline-block shrink-0 rounded-full ${user.isCat ? 'avatar-cat' : ''} ${user.isLive ? 'avatar-live' : ''} ${className}`}
            style={{ width: size, height: size }}
        >
            <Image 
                src={avatarUrl} 
                alt={`${user.username} avatar`} 
                fill
                className="rounded-full object-cover z-10 relative"
            />
            
            {showIndicator && user.onlineStatus && (
                <div className={`absolute bottom-0 right-0 w-[20%] h-[20%] rounded-full border-2 border-[#191919] z-30 ${
                    user.onlineStatus === 'online' ? 'bg-green-500' : 
                    user.onlineStatus === 'active' ? 'bg-yellow-500' : 
                    user.onlineStatus === 'offline' ? 'bg-gray-500' : 'bg-gray-500'
                }`}></div>
            )}

            {decorationsToShow.map(decoration => (
                <div 
                    key={decoration.id} 
                    className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] pointer-events-none z-20 flex items-center justify-center"
                    style={getDecorationStyle(decoration)}
                >
                    <img 
                        src={decoration.url} 
                        alt="" 
                        className="w-full h-full object-contain"
                    />
                </div>
            ))}
        </div>
    )
}
