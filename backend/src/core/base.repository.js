class BaseRepository {
    constructor(model) {
        this.model = model;
    }

    async findAll(options = {}) {
        return await this.model.findAll(options);
    }

    async findById(id, options = {}) {
        return await this.model.findByPk(id, options);
    }

    async create(data) {
        return await this.model.create(data);
    }

    async update(id, data) {
        const record = await this.model.findByPk(id);
        if (!record) return null;
        return await record.update(data);
    }

    async delete(id) {
        const record = await this.model.findByPk(id);
        if (!record) return null;
        return await record.destroy();
    }
}

export default BaseRepository;
