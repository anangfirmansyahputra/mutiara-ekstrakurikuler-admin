import { Button, Card, Col, Descriptions, Modal, Row, Table } from "antd";
import dayjs from "dayjs";

export default function DetailSiswaModal(props) {
    const { data } = props
    const wajib = data?.nilai?.ekstrakurikulerWajib
    const pilihan = data?.nilai?.ekstrakurikulerPilihan

    const totalNilai = (akademik, data) => {
        const nilaiAkademik = (akademik * 70 / 100)
        // const nilaiAbsen = ((absen / 14) * 100) * 40 / 100
        const totalTrue = data?.filter((item) => item === true).length;

        // Menghitung total panjang array
        const totalLength = data?.length;

        // Menghitung persentase nilai true

        const nilaiAbsen = Math.ceil(((totalTrue / totalLength) * 100) * 30 / 100);

        const nilaiTotal = nilaiAbsen + nilaiAkademik

        if (nilaiTotal > 85) {
            return `${nilaiTotal} | A`
        } else if (nilaiTotal >= 75 && nilaiTotal < 86) {
            return `${nilaiTotal} | B`
        } else {
            return `${nilaiTotal} | C`
        }
    }

    const nilaiAbsen = (data) => {
        const totalTrue = data?.filter((item) => item === true).length;

        // Menghitung total panjang array
        const totalLength = data?.length;

        // Menghitung persentase nilai true
        const percentageTrue = Math.ceil((totalTrue / totalLength) * 100);

        return percentageTrue
    }

    const columns = [
        {
            title: 'Keterangan',
            dataIndex: 'keterangan',
            key: 'keterangan',
        },
        {
            title: 'Persentase',
            dataIndex: 'persentase',
            key: 'persentase',
        },
    ];

    const dataSource = [
        {
            key: '1',
            keterangan: 'Nilai Absen',
            persentase: '30%',
        },
        {
            key: '2',
            keterangan: 'Nilai Praktek',
            persentase: '70%',
        },
        {
            key: '3',
            keterangan: 'Total',
            persentase: '100%',
        },
    ];

    const columns2 = [
        {
            title: 'Nilai Angka',
            dataIndex: 'nilaiAngka',
            key: 'nilaiAngka',
        },
        {
            title: 'Nilai Huruf',
            dataIndex: 'nilaiHuruf',
            key: 'nilaiHuruf',
        },
    ];

    const dataSource2 = [
        {
            key: '1',
            nilaiAngka: '85 < nilai ≤ 100',
            nilaiHuruf: 'A',
        },
        {
            key: '2',
            nilaiAngka: '75 ≤ nilai ≤ 85',
            nilaiHuruf: 'B',
        },
        {
            key: '3',
            nilaiAngka: '0 ≤ nilai < 75',
            nilaiHuruf: 'C',
        },
    ];

    return (
        <Modal open={props.open} onCancel={props.onCancel} footer={<Button onClick={() => props.onCancel()}>Tutup</Button>} width={1200} title="Detail Siswa" centered style={{
            top: 20
        }}>
            <Card title="1. Profil Siswa" size="small" className="m-[20px]" style={{ marginBottom: "1rem" }}>
                <Row>
                    <Col span={12}>
                        <Descriptions size="small" bordered column={1}>
                            <Descriptions.Item labelStyle={{
                                width: "40%"
                            }} label="Nama">{data?.name}</Descriptions.Item>
                            <Descriptions.Item label="NIS">{data?.nis}</Descriptions.Item>
                            <Descriptions.Item label="Kelas">{`${data?.kelas?.kelas} ${data?.kelas?.name}`}</Descriptions.Item>
                            <Descriptions.Item label="Jenis Kelamin">{data?.gender === "L" ? "Laki - laki" : "Perempuan"}</Descriptions.Item>
                            <Descriptions.Item label="Tempat Tanggal Lahir">{`${data?.bop}, ${dayjs(data?.tgl).format('YYYY-MM-DD')}`}</Descriptions.Item>
                            <Descriptions.Item label="Nomor Telp">{data?.noTlp}</Descriptions.Item>
                            <Descriptions.Item label="Alamat">{data?.alamat}</Descriptions.Item>
                        </Descriptions>
                    </Col>
                </Row>
            </Card>
            <Card title="2. Nilai Siswa" size="small" className="m-[20px]">
                <Row gutter={16}>
                    <Col span={12}>
                        <Descriptions size="small" bordered column={1}>
                            <Descriptions.Item labelStyle={{
                                width: "40%"
                            }} label="Ekstrakurikuler Wajib">{wajib?.ekstrakurikuler?.name ?? "Belum memilih"}</Descriptions.Item>
                            <Descriptions.Item label="Nilai Akademik">{wajib?.nilai}</Descriptions.Item>
                            <Descriptions.Item label="Nilai Absen">{nilaiAbsen(wajib?.kehadiran)}</Descriptions.Item>
                            <Descriptions.Item label="Nilai Total">
                                {totalNilai(wajib?.nilai, wajib?.kehadiran)}
                            </Descriptions.Item>
                        </Descriptions>
                        <div className="flex w-full gap-5">
                            <Table bordered style={{
                                marginTop: "10px",
                                width: "100%"
                            }} columns={columns} dataSource={dataSource} pagination={false} />
                            <Table bordered style={{
                                marginTop: "10px",
                                width: "100%"
                            }} columns={columns2} dataSource={dataSource2} pagination={false} />
                        </div>
                    </Col>
                    <Col span={12}>
                        <Descriptions size="small" bordered column={1}>
                            <Descriptions.Item labelStyle={{
                                width: "40%"
                            }} label="Ekstrakurikuler Pilihan">{pilihan?.ekstrakurikuler?.name ?? "Belum memilih"}</Descriptions.Item>
                            <Descriptions.Item label="Nilai Akademik">{pilihan?.nilai}</Descriptions.Item>
                            <Descriptions.Item label="Nilai Absen">{nilaiAbsen(pilihan?.kehadiran)}</Descriptions.Item>
                            <Descriptions.Item label="Nilai Total">
                                {totalNilai(pilihan?.nilai, pilihan?.kehadiran)}
                            </Descriptions.Item>
                        </Descriptions>
                        <div className="flex w-full gap-5">
                            <Table bordered style={{
                                marginTop: "10px",
                                width: "100%"
                            }} columns={columns} dataSource={dataSource} pagination={false} />
                            <Table bordered style={{
                                marginTop: "10px",
                                width: "100%"
                            }} columns={columns2} dataSource={dataSource2} pagination={false} />
                        </div>
                    </Col>
                </Row>
            </Card>
        </Modal>
    )
}