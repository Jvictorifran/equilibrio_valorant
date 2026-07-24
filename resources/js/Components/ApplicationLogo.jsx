export default function ApplicationLogo(props) {
    return (
        <svg {...props} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="17" width="40" height="3" rx="1" fill="#E7EDF2" />
            <polygon points="24,19 18,32 30,32" fill="#232E38" />
            <line
                x1="8"
                y1="19"
                x2="8"
                y2="22"
                stroke="#E7EDF2"
                strokeWidth="2"
            />
            <line
                x1="40"
                y1="19"
                x2="40"
                y2="22"
                stroke="#E7EDF2"
                strokeWidth="2"
            />
            <polygon points="2,22 14,22 8,33" fill="#34E6C7" />
            <polygon points="34,22 46,22 40,33" fill="#FF8A4C" />
        </svg>
    );
}
