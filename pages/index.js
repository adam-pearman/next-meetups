import MeetupList from "../components/meetups/MeetupList";
import {MongoClient} from "mongodb";
import Head from "next/head";

// Static Site Generation (SSG) - Better if pages don't need to update as often, however revalidate can help.
export const getStaticProps = async () => {
    const client = await MongoClient.connect(process.env.DB_CONNECTION)
    const db = client.db()

    const meetupsCollection = db.collection('meetups')

    const meetups = await meetupsCollection.find().toArray()

    client.close().then()

    return {
        props: {
            meetups: meetups.map(meetup => ({
                id: meetup._id.toString(),
                title: meetup.title,
                image: meetup.image,
                address: meetup.address,
            })),
        },
        revalidate: 1,
    }
}

// Server-Side Rendering (SSR) - Only really need to use if you require access to request and response.
// export const getServerSideProps = async (context) => {
//     const req = context.req
//     const res = context.res
//
//     return {
//         props: {
//             meetups: DUMMY_MEETUPS,
//         }
//     }
// }

const HomePage = (props) => {
    return (
        <>
            <Head>
                <title>React Meetups</title>
                <meta name="description"
                      content="Browse a huge list of highly active React meetups!"
                />
            </Head>
            <MeetupList meetups={props.meetups} />
        </>
    )
}


export default HomePage