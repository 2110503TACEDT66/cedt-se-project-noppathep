import RatingForm from '@/components/RatingForm';

export default function reservation({params, searchParams}: {params: {rid: string, rating?: number}, searchParams?: { rated?: boolean, rating?: number, comment?: string };}) {
    return (
        <RatingForm rid={params.rid} rated={searchParams?.rated} rating={searchParams?.rating} comment={searchParams?.comment}/>
    )
}