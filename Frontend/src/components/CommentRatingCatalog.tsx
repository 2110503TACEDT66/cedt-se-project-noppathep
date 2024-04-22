export default function CommentRatingCatalog({ratings}:{ratings:any}) {
    return (
        <div className="flex flex-col gap-3">
            {
                ratings.data.map((item:any) => {
                    <div key={item._id} className="">
                        <div>
                            {item.user}
                        </div>
                        <div>
                            {item.rating}
                        </div>
                        <div>
                            {item.comment}
                        </div>
                    </div>
                })
            }
        </div>
    )
}