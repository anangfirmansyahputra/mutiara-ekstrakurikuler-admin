import ekstrakurikulerService from "@/services/ekstrakurikuler.service";
import nilaiService from "@/services/nilai.service";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Modal, Table, Card, Space } from "antd";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import Swal from "sweetalert2";

export default function NilaiModal(props) {
    const [form] = Form.useForm()
    const router = useRouter()
    const searchInput = useRef(null);

    const [open, setOpen] = useState(false)
    const [selectSiswa, setSelecSiswa] = useState(null)
    const [searchedColumn, setSearchedColumn] = useState("")

    const [searchText, setSearchText] = useState('');
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const data = props?.data?.pendaftar?.map(item => ({
        key: item?._id,
        name: item?.name,
        nis: item?.nis,
        kelas: `${item?.kelas?.kelas} ${item?.kelas?.name}`,
        nilai: item?.nilai?.[props?.data?.wajib ? 'ekstrakurikulerWajib' : 'ekstrakurikulerPilihan']?.nilai
    }))

    const handleNilai = (id, name) => {
        form.setFieldsValue({ name: name })
        setSelecSiswa(id)
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
        setSelecSiswa(null)
        form.resetFields()
    }

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: "block",
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}>
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}>
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}>
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}>
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? "#1890ff" : undefined,
                }}
            />
        ),
        onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ""}
                />
            ) : (
                text
            ),
    });

    const columns = [
        {
            title: "Nama",
            key: "name",
            dataIndex: "name"
        },
        {
            title: "NIS",
            key: "nis",
            dataIndex: "nis"
        },
        {
            title: "Kelas",
            key: "kelas",
            dataIndex: "kelas",
            ...getColumnSearchProps("kelas"),
        },
        {
            title: "Nilai Praktek",
            key: "nilai",
            dataIndex: "nilai"
        },
        {
            title: "Aksi",
            fixed: "right",
            width: "100px",
            render: (_, record) => (
                <Button type="primary" onClick={() => handleNilai(record?.key, record?.name)}>Beri Nilai</Button>
            )
        },
    ]

    const handleSubmit = async (values) => {
        const payload = {
            wajib: props?.data?.wajib,
            nilai: values.nilai
        }

        Swal.fire({
            icon: "question",
            title: "Apa anda yakin?",
            text: "Data akan dirubah",
            showDenyButton: true,
            confirmButtonText: 'Yakin',
            denyButtonText: `Tidak`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await nilaiService.beriNilai(selectSiswa, payload)
                    Swal.fire({
                        icon: 'success',
                        title: "Sukses",
                        text: "Data berhasil diupdate"
                    })
                    router.push(router.asPath)
                    setOpen(false)
                    form.resetFields()
                    setSelecSiswa(null)
                    // props.onCancel()
                    const resData = await ekstrakurikulerService.find(props?.data?._id)
                    props?.setDataPendaftar(resData.data)
                } catch (err) {
                    console.log(err);
                    const messageErr = JSON.parse(err?.request?.response)?.message
                    Swal.fire({
                        icon: 'error',
                        title: "Gagal",
                        text: messageErr ?? "Data gagal dirubah, coba ganti data dan coba kembali!"
                    })
                }
            } else if (result.isDenied) {
            }
        })
    }


    return (
        <>
            <Modal open={props.open} onCancel={props.onCancel} footer={<Button onClick={props.onCancel}>Tutup</Button>} width={1200} title="Form Nilai">
                <Card className="m-[20px]">
                    <Table columns={columns} dataSource={data} />
                </Card>
            </Modal>
            <Modal open={open} title="Beri Nilai" onOk={() => form.submit()} onCancel={handleClose}>
                <Card className="m-[20px]">
                    <Form form={form} colon={false} layout="vertical" onFinish={handleSubmit}>
                        <Form.Item label="Nama" name="name">
                            <Input disabled />
                        </Form.Item>
                        <Form.Item label="Nilai Praktek" name="nilai">
                            <InputNumber placeholder="0" style={{ width: "100%" }} maxLength={3} max={100} />
                        </Form.Item>
                    </Form>
                </Card>
            </Modal>
        </>
    )
}