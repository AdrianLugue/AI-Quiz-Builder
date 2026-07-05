import {clsx} from 'clsx';
import {cn} from '@/lib/utils';
type BarProps = {
    percentage: number,
    color: string
}

const Bar = (props:BarProps) => {
    const {
        percentage,
        color,
    } = props;
    const barStyle = {
        height: `${percentage}%`
    }
    const barBgClasses :  Record<string,string> ={
        'green': 'bg-green-500',
        'red': 'bg-red-500',
        'blue': 'bg-blue-500'
    }

    
    return (
        <div className='h-40 flex items-end justify-end'>
            <div className={clsx(barBgClasses[color], "w-16 rounded-t-lg transition-all duration-1000 ease-out border-2 border-black border")} 
            style={barStyle}></div>
        </div>
    )
}
export default Bar;