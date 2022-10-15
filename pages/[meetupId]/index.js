import MeetupDetail from "../../components/meetups/MeetupDetail";
import {MongoClient, ObjectId} from "mongodb";
import Head from "next/head";

export const getStaticPaths = async () => {
    const client = await MongoClient.connect(process.env.DB_CONNECTION)
    const db = client.db()

    const meetupsCollection = db.collection('meetups')

    const meetups = await meetupsCollection.find({}, {projection: {_id: 1}}).toArray()

    client.close().then()

    return {
        fallback: 'blocking',
        paths: meetups.map(meetup => ({
            params: {
                meetupId: meetup._id.toString()
            }
        }))
    }
}

export const getStaticProps = async (context) => {
    const client = await MongoClient.connect(process.env.DB_CONNECTION)
    const db = client.db()

    const meetupsCollection = db.collection('meetups')

    const meetupId = context.params.meetupId

    const selectedMeetup = await meetupsCollection.findOne({_id: ObjectId(meetupId)})

    client.close().then()

    return {
        props: {
            meetupData: {
                id: selectedMeetup._id.toString(),
                title: selectedMeetup.title,
                image: selectedMeetup.image,
                address: selectedMeetup.address,
                description: selectedMeetup.description,
            }
        }
    }
}

const MeetupDetails = (props) => {
    return (
        <>
            <Head>
                <title>{props.meetupData.title}</title>
                <meta name="description"
                      content={props.meetupData.description}
                />
            </Head>
            <MeetupDetail
                image={props.meetupData.image}
                title={props.meetupData.title}
                address={props.meetupData.address}
                description={props.meetupData.description}
            />
        </>
    )
}

export default MeetupDetails