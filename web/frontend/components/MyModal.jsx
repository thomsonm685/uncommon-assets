import { Modal, Stack, Heading, Spinner } from "@shopify/polaris";


const MyModal = ({primaryAction, content, title, modalActive, primaryText, status, closeModal}) => {

    return(
        <>
            <Modal
                open={modalActive}
                title={title}
                onClose= {closeModal}
                primaryAction={primaryAction?{
                content: primaryText,
                onAction: primaryAction,
                }:null}
            >
                <Modal.Section>
                <Stack vertical>
                    {status==='success'?
                    <>
                    <Heading>Success!</Heading>
                    </>
                    :status==='error'?
                    <>
                    <Heading>Error!</Heading>
                    </>
                    :status==='loading'?
                    <>
                        <div style={{width:'min-content', margin:'50px auto'}}>
                            <Spinner></Spinner>
                        </div>
                    </>
                    :content}
                </Stack>
                </Modal.Section>
            </Modal>
        </>
    )
}

export default MyModal;